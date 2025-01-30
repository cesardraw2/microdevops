import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {FileUtils} from "app/core/util/file-utils";


@Component({
  selector: 'app-search-class',
  templateUrl: './search-class.component.html',
  styleUrls: ['./search-class.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule]
})
export class SearchClassComponent {
  private fb = inject(FormBuilder);

  searchForm: FormGroup;
  result: string = '';

  constructor() {
    this.searchForm = this.fb.group({
      className: ['', [Validators.required, Validators.maxLength(300)]],
      dir: ['', Validators.required]
    });
  }

  async onSearch() {
    const { className, dir } = this.searchForm.value;
    try {
      const jarsWithClass = await FileUtils.findClassInJars(dir, className);
      this.result = jarsWithClass.join('\n');
    } catch (error) {
      this.result = `Erro ao procurar a classe nos JARs: ${error.message}`;
    }
  }

  onClear() {
    this.result = '';
    this.searchForm.reset();
  }
}
