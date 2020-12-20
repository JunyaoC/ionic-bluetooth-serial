import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { JoystickComponent } from '../joystick/joystick.component'



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, JoystickComponent],
  providers:[BluetoothSerial]
})
export class HomePageModule {}
