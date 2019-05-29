import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, ModalController } from '@ionic/angular';
import { AutenticacaoService } from './services/autenticacao.service';
import { Perfil } from './modelos/perfil';
import { Environment } from '@ionic-native/google-maps';
import {FcmService} from '../app/providers/fcm.service';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  perfil = {} as Perfil;

  
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Sobre o App',
      url: '/sobre',
      icon: 'information-circle-outline'
    },
    {
      title: 'Administrador',
      url: '/admin',
      icon: 'glasses'
    }
  ];
  

  userEmail: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private authService: AutenticacaoService,
    private fcm: FcmService,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(this.authService.dadosUsuario()){        
       console.log('ok');
      }else{
        this.navCtrl.navigateBack('');
      }
      this.fcm.getToken();
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE':'AIzaSyCzj_-lvznr3ry-5fqvKPFTODGHQCatoso',
        'API_KEY_FOR_BROWSER_DEBUG':'AIzaSyCzj_-lvznr3ry-5fqvKPFTODGHQCatoso'
      });
      this.fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          this.showMessage(msg.body);
        })
      )
      .subscribe()
    });
  }

  async showMessage(msgNotif){
    const toast = await this.toastCtrl.create({
      message: msgNotif,
      duration: 3000
    });
    toast.present();
  }
  logoff(){
    this.authService.logoffUsuario()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    })
  }
}
