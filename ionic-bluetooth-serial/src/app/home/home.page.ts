import { Component, NgZone, ViewChild} from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ActionSheetController } from '@ionic/angular';
import { JoystickComponent } from '../joystick/joystick.component'
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {

	bluetoothData:string = 'no data'
	pairedDevices = []

	connected:boolean = false
	commands = []

	constructor(
		private bluetoothSerial: BluetoothSerial,
		public actionSheetController: ActionSheetController,
		private zone: NgZone,
		private storage: Storage,
		public alertController: AlertController
		) {}

	ionViewDidEnter(){
		let bluetoothDataSub = this.bluetoothSerial.subscribe('\n')
		bluetoothDataSub.subscribe( data => {
			this.bluetoothData = data
		})

		this.checkConnected()
		this.checkAddedCommand()
		
	}

	checkConnected(){

		this.zone.run( () => {
			let checkBluetooth = this.bluetoothSerial.isConnected();
			checkBluetooth.then(
				success => {
					this.connected = true;

				},
				failed=>{
					this.connected = false
				}
				)
		})		
	}

	checkAddedCommand(){
		this.storage.get('commands').then((val) => {
			if(val){
				this.commands = JSON.parse(val)
			}
		});
	}

	makeDiscoverable(){
		this.bluetoothSerial.setDiscoverable(0);
	}

	search(){
		this.bluetoothSerial.discoverUnpaired().then( success => {
			console.log(success)
		} )
	}

	list(){
		let newPromise =  new Promise(resolve => {

			this.bluetoothSerial.list().then( success => {
				console.log(success)

				this.pairedDevices = []

				for(let i=0;i<success.length;i++){
					this.pairedDevices.push({
						name: success[i].name,
						address: success[i].address,
					})
				}

				resolve('listing done')

			} )

		})

		return newPromise;
	}

	connect(device){
		let connectSub = this.bluetoothSerial.connect(device.address);
		connectSub.subscribe( data => {
			console.log('connect',data)
			this.checkConnected()			
		})
	}

	say(msg){
		if(msg){
			msg = msg + '\r\n'
			this.bluetoothSerial.write(msg)
		}else{
			let msg = prompt('Say Something')
			msg = msg + '\r\n'
			this.bluetoothSerial.write(msg)
		}
	}

	disconnect(){
		this.bluetoothSerial.disconnect().then( () =>{
			this.checkConnected()
		});
	}

	async selectDevice(){
		await this.list()

		let options = [];

		for(let i =0;i<this.pairedDevices.length;i++){
			options.push({
				text:this.pairedDevices[i].name,
				address:this.pairedDevices[i].address,
				handler: ()=>{
					this.connect(this.pairedDevices[i])
				}
			})
		}

		options.push({
			text: 'Cancel',
			icon: 'close',
			role: 'cancel',
			handler: () => {
				console.log('Cancel clicked');
			}
		})

		const actionSheet = await this.actionSheetController.create({
			header: 'Connect Paired Device',
			cssClass: 'my-custom-class',
			buttons: options,
			mode:'ios'
		});
		await actionSheet.present();
	}

	joystickMoved(e:any){
		this.say('X: ' + e.x + 'Y: ' + e.y)
	}

	async promptAddCommand() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'New Command',
      inputs: [
        {
          name: 'label',
          type: 'text',
          placeholder: 'Enter Command Label'
        },
        // multiline input.
        {
          name: 'command',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Command Content'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: ($event) => {
            this.createCommand($event)
          }
        }
      ]
    });

    await alert.present();
  }

  createCommand(e){
  	this.commands.push({
  		label:e.label,
  		command:e.command
  	})

  	this.storage.set('commands',JSON.stringify(this.commands))

  }

  executeCmd(command){
  	this.say(command.command)
  }

  deleteCmd(command){

  	if(confirm('Delete ' + command.label + ' ?')){

  		let index = this.commands.find(cmd => cmd.command == command.command)
  		this.commands.splice(index,1)
  		this.storage.set('commands',JSON.stringify(this.commands))
  	}

  }

}
