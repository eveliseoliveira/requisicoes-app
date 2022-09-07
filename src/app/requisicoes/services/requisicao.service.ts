import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  private registros: AngularFirestoreCollection<Requisicao>;

  constructor(private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Requisicao>("requisicao");
  }

  public async inserir(registro: Requisicao): Promise<any>{
    if(!registro)
      return Promise.reject("Item inválido")

    const res = await this.registros.add(registro);

      registro.id = res.id;

      this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).delete();
 }

  public selecionarTodos(): Observable<Requisicao[]>{
    return this.registros.valueChanges()
      .pipe(
        map((requisicoes: Requisicao[]) => {
          requisicoes.forEach(req => {
            if(req.departamentoId != null) {
            this.firestore
              .collection<Departamento>("departamento")
              .doc(req.departamentoId)
              .valueChanges()
              .subscribe(x => req.departamento = x);
            }
            if(req.equipamentoId != null) {
              this.firestore
                .collection<Equipamento>("equipamento")
                .doc(req.equipamentoId)
                .valueChanges()
                .subscribe(x => req.equipamento = x);
              }
          });

          return requisicoes;
        })
      );
  }
}
