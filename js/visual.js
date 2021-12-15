import { Text } from './text.js';
import { Particle } from './particles.js';

export class Visual {
    //(2) Visual 객체 생성자
    constructor(){
        //Text 객체 동적할당
        this.text = new Text();

        this.texture = PIXI.Texture.from('../particle.png');

        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 100,
        };

        //pointer가 움직일때마다 onMove함수에 this 바인드
        document.addEventListener('pointrmove', this.onMove.bind(this), false)
    }

    show(stageWidth, stageHeight, stage){
        if(this.container){
            stage.removeChild(this.container);
        }

        this.pos = this.text.setText('A', 2, stageWidth, stageHeight);
        console.log(this.pos[0]);
        this.container = new PIXI.ParticleContainer(
            this.pos.length, 
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false, 
                uvs: false,
                tint: false
            }
        );
        stage.addChild(this.container);

        this.particles = [];
        for(let i = 0; i < 1; i++){
            const item = new Particle(this.pos[i], this.texture);
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }
    }

    //(5) Visual animation 실행
    animate(){
        for (let i =0; i< this.particles.length; i++){
            const item = this.particles[i];
            const dx = this.mouse.x - item.x;
            const dy = this.mouse.y - item.y;
            //클릭된 
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius;

            if(dist< minDist){
                const angle = Math.atan2(dy, dx);
                const tx = item.x + Math.cos(angle) * minDist;
                const ty = item.y + Math.sin(angle) * minDist;
                const ax = tx - this.mouse.x;
                const ay = ty - this.mouse.y;
                item.vx -= ax;
                item.vy -= ay;
            }

            item.draw();
        }
    }

    //onMove: 현재 mouse의 위치를 현재 Visual 객체의 좌표로 설정
    onMove(e){
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
}