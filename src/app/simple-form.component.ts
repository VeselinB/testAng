import { TemplateLiteralElement } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TitleService } from './title.service';

import { Title } from './title.model';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { map, filter, tap, mergeAll, switchMap, exhaustMap, concatMap, mergeMap, flatMap, interval, take, concat, toArray } from 'rxjs';
import { title } from 'process';

@Component({
  selector: 'simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.css']
})

export class SimpleFormComponent implements OnInit {
  constructor(private titlesService: TitleService, private formBuilder: FormBuilder) { }

  public titles: Title[] = [];
  public form: FormGroup;
  public disableButton: Boolean = true;
  public invalidLastNameField: Boolean = false;

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      title: [],
      firstName: [""],
      lastName: ["", Validators.required],
    })

    this.titlesService.getTitles()
      .pipe(
        mergeMap(Titles => Titles),
        filter((title) => title.name !== '!'),
        toArray(),
        map((titles: Title[]) => titles.sort((a, b) => a.name.localeCompare(b.name))),
      )
      .subscribe((titles: any) => {
        this.titles = titles;
        this.form.patchValue({ title: this.titles.filter(title => title.isDefault)[0].name });
      })
  }

  validateLastNameField(e) {
    e.target.style.outlineColor = this.form.get('lastName').status === 'INVALID' ? 'red' : 'black';
    if (e.type === "focusout") this.invalidLastNameField = this.form.get('lastName').status === 'INVALID' ? true : false;
  }

  submit() {
    this.invalidLastNameField = this.form.get('lastName').status === 'INVALID' ? true : false;
    if (!this.invalidLastNameField) console.log(this.form.value);
  }

  selectTitle(e) {
    console.log(e.target.value);
  }

  checkbox(e) {
    this.disableButton = !e.target.checked;
  }
}


