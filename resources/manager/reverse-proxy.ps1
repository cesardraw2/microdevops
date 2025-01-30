param (
    [int]$proxyPort = 8080,
    [string]$vmIp = "172.21.237.173",
    [string]$servicesFilePath = "services.json"
)

# Load HttpClient
Add-Type -AssemblyName 'System.Net.Http'

# Function to load services from JSON file
function Load-Services {
    param ([string]$filePath)
    if (Test-Path -Path $filePath) {
        $jsonContent = Get-Content -Path $filePath -Raw
        $services = $jsonContent | ConvertFrom-Json
        return $services.services
    } else {
        Write-Host "Services file not found: $filePath"
        exit 1
    }
}

# Load services
$services = Load-Services -filePath $servicesFilePath

# Map of subdomains to internal ports
$subdomainMap = @{}
foreach ($service in $services) {
    $subdomain = $service.externalHostName -replace "\.localhost$", ""
    $subdomainMap[$subdomain] = $service.internalPort
}

# Function to start the reverse proxy server
function Start-ReverseProxy {
    param ([int]$port)
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://*:$port/")
    $listener.Start()
    Write-Host "Proxy server started on port $port"

    try {
        while ($true) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            if ($request.Headers["Host"] -ne $null) {
                $hostHeader = $request.Headers["Host"]
                $subdomain = $hostHeader -replace "\.localhost.*", ""

                if ($subdomainMap.ContainsKey($subdomain)) {
                    $internalPort = $subdomainMap[$subdomain]
                    $proxyUrl = "http://${vmIp}:${internalPort}${request.Url.PathAndQuery}"

                    Write-Host "Requesting URL: $proxyUrl"

                    $client = New-Object System.Net.Http.HttpClient
                    $proxyRequest = New-Object System.Net.Http.HttpRequestMessage($request.HttpMethod, $proxyUrl)

                    # Copy headers
                    foreach ($header in $request.Headers.Keys) {
                        $headerValue = $request.Headers.Get($header)
                        if (-not $proxyRequest.Headers.TryAddWithoutValidation($header, $headerValue)) {
                            if ($proxyRequest.Content -ne $null) {
                                $proxyRequest.Content.Headers.TryAddWithoutValidation($header, $headerValue)
                            }
                        }
                    }

                    # Copy content if present
                    if ($request.HasEntityBody) {
                        $streamReader = New-Object System.IO.StreamReader($request.InputStream)
                        $content = $streamReader.ReadToEnd()
                        $proxyRequest.Content = [System.Net.Http.StringContent]::new($content, [System.Text.Encoding]::UTF8, $request.ContentType)
                    }

                    $proxyResponse = $client.SendAsync($proxyRequest).Result

                    # Copy response headers, excluding problematic ones
                    $excludedHeaders = @("Transfer-Encoding", "Content-Length", "Keep-Alive", "Connection", "Trailer", "Upgrade", "Proxy-Authorization", "Proxy-Authenticate")
                    foreach ($header in $proxyResponse.Headers) {
                        if (-not $excludedHeaders.Contains($header.Key)) {
                            $response.Headers.Add($header.Key, [string]::Join(";", $header.Value))
                        }
                    }
                    foreach ($header in $proxyResponse.Content.Headers) {
                        if (-not $excludedHeaders.Contains($header.Key)) {
                            $response.Headers.Add($header.Key, [string]::Join(";", $header.Value))
                        }
                    }

                    # Copy response content
                    $response.StatusCode = [int]$proxyResponse.StatusCode
                    $response.StatusDescription = $proxyResponse.ReasonPhrase
                    $response.ContentType = $proxyResponse.Content.Headers.ContentType.ToString()
                    $outputStream = $response.OutputStream
                    $proxyResponse.Content.CopyToAsync($outputStream).Wait()
                    $outputStream.Close()
                } else {
                    $response.StatusCode = 404
                    $response.StatusDescription = "Not Found"
                    $response.Close()
                }
            } else {
                $response.StatusCode = 400
                $response.StatusDescription = "Bad Request"
                $response.Close()
            }
        }
    } finally {
        $listener.Stop()
    }
}

# Start the reverse proxy
Start-ReverseProxy -port $proxyPort
