import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {

  constructor(private afs:AngularFirestore) { }

  getOcorrencia(){
    return this.afs.collection('ocorrencia', ref => ref.orderBy('ocorrencia')).valueChanges();
  }
}