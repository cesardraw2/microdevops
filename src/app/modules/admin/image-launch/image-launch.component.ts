import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InstallService} from "app/modules/admin/services/install.service";
import {IServer} from "app/modules/admin/image-launch/IServer";
import {Server} from "app/modules/admin/image-launch/Server";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
  selector: 'app-image-launch',
  templateUrl: './image-launch.component.html',
  styleUrls: ['./image-launch.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatGridList,
    MatGridTile
  ],
  standalone: true
})
export class ImageLaunchComponent {


  protected form: FormGroup;

  @Input()
  server:IServer = new Server();

  @Output()
  private onSaved: EventEmitter<IServer> = new EventEmitter();

  @Output()
  private doCreate: EventEmitter<IServer> = new EventEmitter();

  constructor(
      private fb: FormBuilder,
      private installService: InstallService
  ) {
    this.form = this.fb.group({
      name: [this.server.name, Validators.required],
      disk: [this.server.disk, Validators.required],
      mem: [this.server.mem, Validators.required],
      cpus: [this.server.cpus, Validators.required],
      cloudInitPath: ['']
    });
  }

  clearLog() {

  }

  save() {
    //Todo implementar requisição rest para salvar.
    this.server = this.form.value as IServer;
    this.onSaved.emit(this.server);
  }

  create() {
    this.server = this.form.value as IServer;
    this.doCreate.emit(this.server);
  }
}
