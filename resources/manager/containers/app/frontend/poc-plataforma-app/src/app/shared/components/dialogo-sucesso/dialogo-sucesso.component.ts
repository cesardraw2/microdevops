import { Component, OnInit, Inject } from '@angular/core';
import { ModalRef, MODAL_DATA } from '@sicoob/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialogo-sucesso',
  templateUrl: './dialogo-sucesso.component.html',
  styleUrls: ['./dialogo-sucesso.component.scss']
})
export class DialogoSucessoComponent implements OnInit {


  constructor(
    public ref: ModalRef,
    @Inject(MODAL_DATA) public data: any,
    private router: Router) { }

  ngOnInit() {
  }

  navigate(rota: string) {
    this.router.navigate([rota]);
    this.ref.close();
  }

  close(s: boolean) {
    this.ref.close(s);
  }

}
