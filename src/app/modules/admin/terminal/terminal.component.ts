import {
  Component,
  effect,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent implements OnInit, OnDestroy {
  @ViewChild('terminal', { static: true }) terminalDiv!: ElementRef;
  private terminal!: Terminal;
  private fitAddon!: FitAddon;
  private socket: WebSocket;

  @Input()
  protected serviceName:WritableSignal<string>;

  protected url:string = 'ws://dev-server.mshome.net:3000';

  constructor() {
    effect(() => {
      if (this.serviceName()) {

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
          this.socket = new WebSocket(this.url);
          this.initializeSocket();
        }
      }
    });
  }

  ngOnInit(): void {
    this.terminal = new Terminal();
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.terminalDiv.nativeElement);
    this.fitAddon.fit();

    this.terminal.write('Welcome to the terminal emulator!\r\n');

    if (!this.socket) {
      this.socket = new WebSocket(this.url);
      this.initializeSocket();
    }

    this.terminal.onData(data => {
      this.sendCommand(data);
    });
  }

  private initializeSocket(): void {
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.socket.send(JSON.stringify({ type: 'serviceName', data: this.serviceName() }));
    };

    this.socket.onmessage = (event) => {
      this.terminal.write(event.data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from the server');
    };

    this.socket.onerror = error => {
      console.error('WebSocket error', error);
    };
  }

  sendCommand(command: string): void {
    if (command.trim() !== '' && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'command', data: command }));
    }
  }

  ngOnDestroy(): void {
    this.terminal.dispose();
    if (this.socket) {
      this.socket.close();
    }
  }
}
