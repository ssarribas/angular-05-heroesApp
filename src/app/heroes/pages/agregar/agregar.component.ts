import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  }

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    if(!this.router.url.includes('editar')) {
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroe(id))
    )
    .subscribe((heroe) => this.heroe = heroe);
  }

  guardar(){
    if(this.heroe.superhero.trim().length === 0) {
      return;
    }

    if(this.heroe.id) {
      // actualizar
      this.heroesService.actualizarHeroe(this.heroe).subscribe({
        next: (heroe) => {
          this.heroe = heroe;
          this.mostrarSnackBar("Guardado correctamente");
        }
      })
    } else {
      // crear
      this.heroesService.agregarHeroe(this.heroe).subscribe({
        next: (heroe) => {
          this.mostrarSnackBar("Guardado correctamente");
          this.router.navigate(['/heroes/editar', heroe.id]);
        }
      });
    }
  }

  borrar() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '70%',
      data: this.heroe
    });

    dialog.afterClosed().subscribe({
      next: (borrar) => {
        if(borrar) {
          if(this.heroe.id) {
            this.heroesService.borrarHeroe(this.heroe.id).subscribe({
              next: (resp) => this.router.navigate(['/heroes'])
            })
          }
        }
      }
    })
  }

  mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, undefined, {duration: 2500});
  }

}
