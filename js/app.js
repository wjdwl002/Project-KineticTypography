import { Visual } from './visual.js'

class App {
    constructor(){
        this.setWebGl();
        
        WebFont.load({
            google: {
              families: ['Hind:700']
            },
            fontactive: () => {
                //(1) Visual 객체 생성
                this.visual = new Visual(); 

                //창 크기 리사이징 이벤트
                window.addEventListener('resize', this.resize.bind(this). false);
                this.resize()
                
                //(3) animation 요청
                requestAnimationFrame(this.animate.bind(this));
            }
          });
    }
    
    setWebGl(){
        this.renderer = new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            transparent: false, 
            resolution: (window.devicePixelRatio > 1) ? 2 : 1,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0xffffff,
        })
        document.body.appendChild(this.renderer.view);
        
        this.stage = new PIXI.Container();
    }

    resize(){
        console.log("resized");
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.renderer.resize(this.stageWidth, this.stageHeight);

        this.visual.show(this.stageWidth, this.stageHeight, this.stage);
    }
    
    //(4) animation 실행
    animate(t){
        requestAnimationFrame(this.animate.bind(this));

        this.visual.animate();

        this.renderer.render(this.stage);
    }
}

window.onload = () => {
    const app = new App();
};