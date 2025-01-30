import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';

export class FileUtils {

    static async findClassInJars(dir: string, className: string): Promise<string[]> {
        const jarFiles: string[] = await this.getJarFiles(dir);
        const jarsWithClass: string[] = [];

        for (const jar of jarFiles) {
            const hasClass = await this.checkClassInJar(jar, className);
            if (hasClass) {
                jarsWithClass.push(jar);
            }
        }

        return jarsWithClass;
    }

    private static async getJarFiles(dir: string): Promise<string[]> {
        let jarFiles: string[] = [];

        const files = await fs.readdir(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stats = await fs.stat(fullPath);

            if (stats.isDirectory()) {
                jarFiles = jarFiles.concat(await this.getJarFiles(fullPath));
            } else if (file.endsWith('.jar')) {
                jarFiles.push(fullPath);
            }
        }

        return jarFiles;
    }

    private static checkClassInJar(jarPath: string, className: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            exec(`jar tf ${jarPath} | grep ${className}`, (error, stdout, stderr) => {
                if (error) {
                    if (stderr) {
                        reject(new Error(stderr));
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(stdout.includes(className));
                }
            });
        });
    }
}
