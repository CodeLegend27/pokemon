import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  title = "Dominiks Pokedex";
  description = "Pokemons mit Detailansicht";
  loading: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(private pokemonService: PokemonService) { }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {

    if (!this.pokemons.length) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

 /*  Diese Methode called getNext Methode vom Pokemon Service , dann wird die response arranged und
  mit der concat methode um die sequenz des calls beizubehalten

  Danach wird das Ergebnis ins  Pokemon Array gepusht*/
  loadMore(): void {
    this.loading = true;
    this.subscription = this.pokemonService.getNext().subscribe(response => {
      this.pokemonService.next = response.next;
      const details = response.results.map((i: any) => this.pokemonService.get(i.name));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pokemonService.pokemons.push(response);
      });
    }, error => console.log('Error Occurred:', error), () => this.loading = false);
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

}
