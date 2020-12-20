import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-connect-page',
  templateUrl: './connect-page.page.html',
  styleUrls: ['./connect-page.page.scss'],
})
export class ConnectPagePage implements OnInit {

	pairedDevices = []

  constructor(private bluetoothSerial: BluetoothSerial) { }

  ngOnInit() {
  }

  makeDiscoverable(){
  	this.bluetoothSerial.setDiscoverable(0);
  }

}
