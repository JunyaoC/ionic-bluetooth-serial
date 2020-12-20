import { Component, OnInit, ViewChild, ElementRef,  Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-joystick',
	templateUrl: './joystick.component.html',
	styleUrls: ['./joystick.component.scss'],
})
export class JoystickComponent implements OnInit {

	@ViewChild('joystick') joystickElement : ElementRef
	stick:any
	wrapper:any
  	dragStart = null;
  	currentPos = { x: 0, y: 0 };
  	previousPos = { x: 0, y: 0 };
  	maxDiff = 100;
  	stickStyle = {}

  	@Output() moved = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {
		this.stick = document.getElementById('joystick')
		this.wrapper = document.getElementById('wrapper')

		this.createJoystick()

		// setInterval(() => console.log(this.currentPos), 16);
	}

	// const joystick = createJoystick(document.getElementById('wrapper'));

	// setInterval(() => console.log(joystick.getPosition()), 16);

	createJoystick() {
		
		// const stick = document.createElement('div');
		// stick.classList.add('joystick');

		// stick.addEventListener('mousedown', handleMouseDown);
		// document.addEventListener('mousemove', handleMouseMove);
		// document.addEventListener('mouseup', handleMouseUp);
		// // stick.addEventListener('touchstart', handleMouseDown);
		// document.addEventListener('touchmove', handleMouseMove);
		// document.addEventListener('touchend', handleMouseUp);

		this.dragStart = null;
		this.currentPos = { x: 0, y: 0 };
		this.previousPos = this.currentPos;

		

		// parent.appendChild(stick);
		// return {
		// 	getPosition: () => currentPos,
		// };
	}

	handleMouseDown(event) {

			this.dragStart = null;
			this.stick.style.transition = '0s';
			if (event.changedTouches) {
				this.dragStart = {
					x: event.changedTouches[0].clientX,
					y: event.changedTouches[0].clientY,
				};
				return;
			}
			this.dragStart = {
				x: event.clientX,
				y: event.clientY,
			};

		}

		handleMouseMove(event) {

			// this.dragStart = null;
			if (this.dragStart === null) return;
			event.preventDefault();
			if (event.changedTouches) {
				event.clientX = event.changedTouches[0].clientX;
				event.clientY = event.changedTouches[0].clientY;
			}
			const xDiff = event.clientX - this.dragStart.x;
			const yDiff = event.clientY - this.dragStart.y;
			const angle = Math.atan2(yDiff, xDiff);
			const distance = Math.min(this.maxDiff, Math.hypot(xDiff, yDiff));
			const xNew = distance * Math.cos(angle);
			const yNew = distance * Math.sin(angle);
			// this.stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
			console.log(xNew,yNew)
			this.stickStyle = {
				'transform':`translate3d(${xNew}px, ${yNew}px, 0px)`
			}
			this.currentPos = { x: xNew, y: yNew };
			this.moved.emit(this.currentPos);
			this.previousPos = this.currentPos;
		}

		handleMouseUp(event) {
			if (this.dragStart === null) return;
			// stick.style.transform = `translate3d(0px, 0px, 0px)`;
			this.stickStyle = {
				'transition': '.2s',
				'transform':`translate3d(0px, 0px, 0px)`
			}
			this.dragStart = null;
			this.currentPos = { x: 0, y: 0 };
		}

}
