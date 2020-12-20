import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectPagePageRoutingModule } from './connect-page-routing.module';

import { ConnectPagePage } from './connect-page.page';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPagePageRoutingModule
  ],
  declarations: [ConnectPagePage],
  providers:[BluetoothSerial]
})
export class ConnectPagePageModule {}
