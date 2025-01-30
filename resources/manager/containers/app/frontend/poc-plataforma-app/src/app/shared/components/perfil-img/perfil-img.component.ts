import { Component, OnInit, Input } from '@angular/core';
import { User } from '@shared/components/perfil-img/model/user';
import { Role } from '@shared/components/perfil-img/model/role';

@Component({
  selector: 'app-perfil-img',
  templateUrl: './perfil-img.component.html',
  styleUrls: ['./perfil-img.component.css']
})
export class PerfilImgComponent implements OnInit {

  @Input()
  user: User;

  @Input()
  role: Role;

  @Input()
  image = './assets/images/perfil.jpg';

  constructor() { }

  ngOnInit() {
  }

}
