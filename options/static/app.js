
new Vue({
            
    el: '#app',
    data(){ 
        return{
            message: 'Upload Images system',
            debug: false,
            dheader: false,
            dbg:{
                step:0
            },
            downloadingg: false,
            dft_class: 'name',
            filename: '',
            selctedFile: null,
            base64Img: new Image(),
            isPosition: false,
            isDraw: false,
            updateImgData: false,
            default_class_name: 'name',
            width: 0,
            height: 0,
            new_width:0,
            new_height:0,
            scale: 500/300,
            depth:3,
            segmented:0,
            xPos:0,
            yPos: -1,
            localpos:{
                left: 0,
                top: 0
            },
            divs: {
                styleNames: [
                    { 
                        style:{
                            position: 'absolute',
                            left: '0px',
                            top: '-2px',
                            width: '0px',
                            height: '0px',
                            border: '0px dotted #6fff5c',
                        },
                        xmin: 0,
                        xmax: 0,
                        ymin: 0,
                        ymax:0,
                        classname: ''
                    }
                ],
                length: 0
            },
            rulerY :{
                top: '0px',
            },
            rulerX :{
                left: '0px',
            },
            rulerBool: false,
            divs_data_exp:{
                data:
                  {
                    xmin: 0,
                    xmax: 0,
                    ymin: 0,
                    ymax:0,
                    classname: '',
                    keysession: ''
                  },
                length:0,
            },
            mousex:0,
            mousey:0,
            old_left: 0,
            old_top: 0,
            old_width:0,
            keybind: true,
            mode: 'transform',
            pos: {
                left: 0 + 'px',
                top:0 + 'px',
                position: 'static',
                //border: '2px dotted blue',
                backgroundSize: 'contain',
                backgroundImage: "url(" + null + ")",
                backgroundRepeat: "no-repeat",
                imageRendering: 'auto',
                width: 0 + "px",
                height: 0 + "px",
                cursor: 'pointer'
            },
            blur_img: true,
            keysession: 0,
            colorBorder: '#9aff8d',
            deletethis: false,
        }
    },
    created: function(){
        this.keysession = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1;
        console.log(this.keysession);
    },
    mounted() {
        document.addEventListener('keypress', (event) => {
            if (this.keybind){
                const keyName = event.key;
                const keyCode = event.keyCode;
                console.log('keypress event\n\n' + 'key: ' + keyName);
                // if (keyName == 'd'){
                //     this.mode = 'draw';
                // }else if (keyName == 'e'){
                //     this.mode = 'edit';
                // }else if (keyName == 't'){
                //     this.mode = 'transform';
                // }else 
                if (keyName == '=' || keyName == '+'){
                    this.zoom(this.width / 10);
                }else if (keyName == '-' || keyName == '-'){
                    this.zoom(-this.width / 10);
                }
                
                if(keyCode == 26){
                    document.getElementById('prop_text_index').value = new Number(this.divs.length); 
                    this.deleteBox();
                }

            }else{
                setTimeout(() => {
                    //this.keybind = true;
                }, 1000)
                
            }
            
        });
    },
    updated: function () {
        this.$nextTick(function () {
            
            if ((this.updateImgData) && (this.base64Img.naturalWidth == this.old_width) && (this.base64Img.naturalWidth == 0)){
                this.dbg.step += 1;
                console.log('UPDATE')
                if(this.dbg.step > 10){
                    this.old_width = -1;
                    this.dbg.step = 0;
                }
                //console.log(this.base64Img.naturalWidth);
            }else if ((this.updateImgData) && (this.base64Img.naturalWidth != this.old_width) && (this.base64Img.naturalWidth != 0)){
                console.log('NASOL')
                console.log(this.base64Img.naturalWidth);

                this.width = this.base64Img.naturalWidth / 2;
                this.height = this.base64Img.naturalHeight / 2;
                this.new_width = this.width;
                this.new_height = this.height;
                

                this.pos.backgroundImage = 'url(' + this.base64Img.src + ')';
                this.pos.width = this.width + 'px';
                this.pos.height = this.height + 'px';

                this.scale = this.height / this.width;

                this.old_width = this.width*2;

                this.updateImgData = false;
            }  
            var _catch = false
            var colorButton = document.getElementById("primary_color");
            colorButton.onchange = function() {
                    _catch = true;
            }
            if(_catch = true){
                this.colorBorder = colorButton.value;
            }
            
        })
    },
    computed: {
        animatedNumber: function() {
            return this.tweenedNumber.toFixed(0);
        },
        buttonSwitcher: function(){
            switch (this.mode) {
                case 'transform': return 'tr'
                case 'draw': return 'dr'
                case 'edit': return 'edit'
            }
        }
    },
    watch: {
        new_width: function(newValue) {
            TweenLite.to(this.$data.pos, 0.1, { width: newValue + 'px' });
            this.width = this.new_width;
        },
        new_height: function(newValue) {
            TweenLite.to(this.$data.pos, 0.1, { height: newValue + 'px' });
            this.height = this.new_height;
        },
        xPos: function(newValue) {
            TweenLite.to(this.$data.pos, 0.1, { left: newValue + 'px' });
        },
        yPos: function(newValue) {
            TweenLite.to(this.$data.pos, 0.1, { top: newValue + 'px' });
        }
    },
    methods: {
        changeWait(){
            this.keybind = false;
            var lenn =  this.dft_class.length;
            setTimeout(() => {
                if(lenn == this.dft_class.length){
                    this.keybind = true;
                }
            }, 2000)
        },
        async onFileSelected(event){
            this.xPos = 10;
            this.yPos = 10;
            this.pos.left = '10px';
            this.pos.top = '10px';

            console.log(event);
            //this.old_width = -100;
            this.selctedFile = event.target.files[0];
            this.filename = event.target.files[0].name;
            //this.encodeImage(this.selctedFile);
            this.base64Img.src = URL.createObjectURL(this.selctedFile);
            //this.base64Img.src = URL.createObjectURL(this.selctedFile);
            console.log(this.base64Img.naturalWidth);
            //this.pos.backgroundImage = 'url(' + this.base64Img.src + ')';
            this.updateImgData = true;
            this.pos.position = "absolute";

            this.divs.styleNames = [ { style:{position: 'absolute',left: '0px',top: '-80px',width: '0px',height: '0px',border: '0px dotted #6fff5c'},xmin: 0,xmax: 0,ymin: 0,ymax:0,classname: ''}];
            this.divs.length = -1;

            console.log(this.base64Img)
            
        },
        lol(){
            alert('lol');
        },
        debugSw(){
            this.debug = !this.debug;
            this.dheader = this.debug;
        },
        setPosXY(event) {
            if (this.isPosition) {
                //if(this.xPos >= 0)
                this.pos.left = event.clientX - this.old_left + 'px';
                //if((this.yPos > 0) || (this.yPos == -1))
                this.pos.top = event.clientY - this.old_top + 'px';
                this.xPos = event.clientX - this.old_left;
                this.yPos = event.clientY - this.old_top;
                this.pos.position = "absolute";
                this.pos.cursor = 'pointer';
            }
        },
        setDraw(event){
            this.pos.cursor = 'crosshair';
            var topPos = document.getElementById('imgBox').getBoundingClientRect().top;
            var leftPos = document.getElementById('imgBox').getBoundingClientRect().left;
            this.localpos.left = (event.clientX - leftPos) ;
            this.localpos.top = (event.clientY - topPos);

            if(this.isDraw){
                if(this.divs.styleNames[this.divs.length].xmin >= this.localpos.left){
                    this.divs.styleNames[this.divs.length].style.left = this.localpos.left + 'px';
                    this.divs.styleNames[this.divs.length].style.width = this.divs.styleNames[this.divs.length].xmin - this.localpos.left + 'px';
                }else{
                    this.divs.styleNames[this.divs.length].style.width = this.localpos.left - this.divs.styleNames[this.divs.length].xmin + 'px';
                }
                if(this.divs.styleNames[this.divs.length].ymin >= this.localpos.top){
                    this.divs.styleNames[this.divs.length].style.top = this.localpos.top + 'px'
                    this.divs.styleNames[this.divs.length].style.height = this.divs.styleNames[this.divs.length].ymin - this.localpos.top + 'px';
                }else{
                    this.divs.styleNames[this.divs.length].style.height = this.localpos.top - this.divs.styleNames[this.divs.length].ymin + 'px';
                }
                
            
            }
        },
        mouseOver(){
            this.isPosition = false;
        },
        targetMouseX(event){
            this.mousex = event.clientX;
            this.mousey = event.clientY;
            if (this.rulerBool == true){
                var topPos = document.getElementById('borderbox').getBoundingClientRect().top;
                var leftPos = document.getElementById('borderbox').getBoundingClientRect().left;
                this.rulerX.left = (this.mousex - leftPos) + 'px';
                this.rulerY.top = (this.mousey - topPos) + 'px';
            }
            //console.log('TARGET MOUSE X', this.mousex)
        },
        posOff(event){
            this.isPosition = false;   
        },
        posOn(event){
            
            if (!this.isPosition){
                this.old_left = event.clientX - this.xPos;
                if(this.yPos != -1){
                    this.old_top = event.clientY - this.yPos;
                }else{
                    this.old_top = this.height 
                }
            }
            this.isPosition = true;
        },
        zoom(num){
            var sub = this.new_height;
            //var first_width = this.width / this.old_width;
            this.new_width += num;
            //var second_width = this.new_width / this.old_width;
            this.new_height = this.new_width * this.scale;
            sub -= this.new_width * this.scale;
            this.pos.width = this.width + 'px';
            this.pos.height = this.height + 'px';
            this.xPos -= num/2;
            this.yPos += sub/2;

            for (ind in this.divs.styleNames){
                this.divs.styleNames[ind].xmin = this.divs.styleNames[ind].xmin * (this.new_width / this.width);
                this.divs.styleNames[ind].ymin = this.divs.styleNames[ind].ymin * (this.new_height / this.height);
                this.divs.styleNames[ind].xmax = this.divs.styleNames[ind].xmax * (this.new_width / this.width);
                this.divs.styleNames[ind].ymax = this.divs.styleNames[ind].ymax * (this.new_height / this.height);
                
                this.divs.styleNames[ind].style.left = this.divs.styleNames[ind].xmin + 'px';
                this.divs.styleNames[ind].style.width = this.divs.styleNames[ind].xmax - this.divs.styleNames[ind].xmin + 'px';
                this.divs.styleNames[ind].style.top = this.divs.styleNames[ind].ymin + 'px';
                this.divs.styleNames[ind].style.height = this.divs.styleNames[ind].ymax - this.divs.styleNames[ind].ymin + 'px';
                
            }
            //this.pos.left = this.xPos + 'px';
        },
        restPos(){
            this.xPos = 0;
            this.yPos = 0;
            this.pos.left = '0px';
            this.pos.top = '0px';
        },
        restSize(scl){
            var n_height = this.new_width * this.scale;
            var n_width = this.new_width

            this.xPos += (this.width - (this.old_width / scl)) / 2;
            this.yPos += (this.width*this.scale - (this.old_width*this.scale / scl)) / 2;
            
            this.new_width = this.old_width / scl;
            this.new_height = this.old_width*this.scale / scl; 

            for (ind in this.divs.styleNames){
                this.divs.styleNames[ind].xmin = this.divs.styleNames[ind].xmin * (this.new_width / n_width);
                this.divs.styleNames[ind].ymin = this.divs.styleNames[ind].ymin * (this.new_height / n_height);
                this.divs.styleNames[ind].xmax = this.divs.styleNames[ind].xmax * (this.new_width / n_width);
                this.divs.styleNames[ind].ymax = this.divs.styleNames[ind].ymax * (this.new_height / n_height);
                
                this.divs.styleNames[ind].style.left = this.divs.styleNames[ind].xmin + 'px';
                this.divs.styleNames[ind].style.width = this.divs.styleNames[ind].xmax - this.divs.styleNames[ind].xmin + 'px';
                this.divs.styleNames[ind].style.top = this.divs.styleNames[ind].ymin + 'px';
                this.divs.styleNames[ind].style.height = this.divs.styleNames[ind].ymax - this.divs.styleNames[ind].ymin + 'px';
                
            }
        },
        switchMode(val){
            this.mode = val;
            if(val == 'draw'){
                for (ind in this.divs.styleNames){
                    this.divs.styleNames[ind].style.border = '3px dotted ' + this.colorBorder;
                }
            }
        },
        drawOn(event){
            if (this.divs.length != -1){
                this.divs.styleNames.push({ 
                            style:{
                                position: 'absolute',
                                left: this.localpos.left + 'px',
                                top: this.localpos.top + 'px',
                                width: '10px',
                                height: '10px',
                                border: '3px dotted ' + this.colorBorder,
                            },
                            xmin: this.localpos.left,
                            xmax: 0,
                            ymin: this.localpos.top,
                            ymax:0,
                            classname: this.default_class_name });
                this.divs.length += 1;
            }else{
                this.divs.styleNames[0].style = {
                                position: 'absolute',
                                left: this.localpos.left + 'px',
                                top: this.localpos.top + 'px',
                                width: '10px',
                                height: '10px',
                                border: '3px dotted ' + this.colorBorder,
                            },
                this.divs.styleNames[0].xmin = this.localpos.left,
                this.divs.styleNames[0].xmax = 0,
                this.divs.styleNames[0].ymin = this.localpos.top,
                this.divs.styleNames[0].ymax =0,
                this.divs.styleNames[0].classname = this.default_class_name;
                this.divs.length = 0;
            }
            this.isDraw = true;
        },
        drawOff(event){
            console.log(this.divs.styleNames[length]);
            this.divs.styleNames[this.divs.length].style.width = this.localpos.left - this.divs.styleNames[this.divs.length].xmin + 'px';
            this.divs.styleNames[this.divs.length].style.height = this.localpos.top - this.divs.styleNames[this.divs.length].ymin + 'px';
            if(this.divs.styleNames[this.divs.length].xmin > this.localpos.left){
                this.divs.styleNames[this.divs.length].xmax = this.divs.styleNames[this.divs.length].xmin;
                this.divs.styleNames[this.divs.length].xmin = this.localpos.left;
            }else{
                this.divs.styleNames[this.divs.length].xmax = this.localpos.left;
            }
            if(this.divs.styleNames[this.divs.length].ymin > this.localpos.top){
                this.divs.styleNames[this.divs.length].ymax = this.divs.styleNames[this.divs.length].ymin;
                this.divs.styleNames[this.divs.length].ymin = this.localpos.top;
            }else{
                this.divs.styleNames[this.divs.length].ymax = this.localpos.top;
            }

            this.isDraw = false;

        },
        editboxClick(index){
            this.mode = 'edit';
            document.getElementById('prop_text_index').value = index;
            document.getElementById('prop_class_name').value = this.divs.styleNames[index].classname;
            document.getElementById('prop_xmin').value = Math.trunc(this.divs.styleNames[index].xmin);
            document.getElementById('prop_xmax').value = Math.trunc(this.divs.styleNames[index].xmax);
            document.getElementById('prop_ymin').value = Math.trunc(this.divs.styleNames[index].ymin);
            document.getElementById('prop_ymax').value = Math.trunc( this.divs.styleNames[index].ymax);
            for (ind in this.divs.styleNames){
                this.divs.styleNames[ind].style.border = '3px dotted ' + this.colorBorder;
            }
            this.divs.styleNames[index].style.border = '3px dotted #ff4444';
            

        },
        saveEdit(){
            var index = document.getElementById('prop_text_index').value;
            this.divs.styleNames[index].classname = document.getElementById('prop_class_name').value;
            this.divs.styleNames[index].xmin = document.getElementById('prop_xmin').value;
            this.divs.styleNames[index].xmax = document.getElementById('prop_xmax').value;
            this.divs.styleNames[index].ymin = document.getElementById('prop_ymin').value;
            this.divs.styleNames[index].ymax = document.getElementById('prop_ymax').value;
            
            this.divs.styleNames[index].style.left = this.divs.styleNames[index].xmin + 'px';
            this.divs.styleNames[index].style.top = this.divs.styleNames[index].ymin + 'px';
            console.log(this.divs.styleNames[index].classname)
            this.divs.styleNames[index].style.width = this.divs.styleNames[index].xmax - this.divs.styleNames[index].xmin + 'px';
            this.divs.styleNames[index].style.height = this.divs.styleNames[index].ymax - this.divs.styleNames[index].ymin + 'px';
            
        },
        deleteBox(){
            if(this.divs.length > 0){
                this.divs.styleNames.splice(document.getElementById('prop_text_index').value, 1);
                this.divs.length -= 1;
            }else{
                this.divs.styleNames = [ { style:{position: 'absolute',left: '0px',top: '-80px',width: '0px',height: '0px',border: '0px dotted #6fff5c'},xmin: 0,xmax: 0,ymin: 0,ymax:0,classname: ''}];
                this.divs.length = -1;
                this.mode = 'draw';
            }
        },
        deleteKey(){
            alert("Ctrl+z");
        },
        async submitdata(){
            this.mode = 'transform';
            this.downloadingg = true;
            this.divs_data_exp.length = 0;
            for(var ind in this.divs.styleNames){
              if(this.divs_data_exp.length == 0){
                this.divs_data_exp.data = [{ 
                  xmin: Math.round(this.divs.styleNames[ind].xmin),
                  xmax: Math.round(this.divs.styleNames[ind].xmax),
                  ymin: Math.round(this.divs.styleNames[ind].ymin),
                  ymax: Math.round(this.divs.styleNames[ind].ymax),
                  classname: this.divs.styleNames[ind].classname,
                  keysession: this.keysession,
                }];
                this.divs_data_exp.length = 1;
              }else{
                this.divs_data_exp.data.push({ 
                  xmin: Math.round(this.divs.styleNames[ind].xmin),
                  xmax: Math.round(this.divs.styleNames[ind].xmax),
                  ymin: Math.round(this.divs.styleNames[ind].ymin),
                  ymax: Math.round(this.divs.styleNames[ind].ymax),
                  classname: this.divs.styleNames[ind].classname,
                  keysession: this.keysession,
                });
                this.divs_data_exp.length += 1;
              }  
            }
            console.log('data_exp - ', this.divs_data_exp.data)
            var _export_opt = {
              //'data': this.divs_data_exp.data,
              'width': Math.round(this.old_width), 
              'height': Math.round(this.old_width * this.scale),
              'filename': this.filename + '',
              'keysession': this.filename + this.keysession,
              'depth': this.depth,
              'segmented': this.segmented,
              'csrfmiddlewaretoken': '4pCIlkqQHp7bFVnICyaIeqVNmN7HVqTlvQs34wELXETKONEraYBXVthNmztteWT6',
            };
            console.log('_export_opt', _export_opt);
            //const j_export_opt = JSON.stringify(_export_opt);
            const j_export_box = JSON.stringify(this.divs_data_exp.data);
            //console.log('EXPORT = ', j_export_opt);
            
            var pojiloygibon24 = Cookies.get('csrftoken');
            var bbox_post = false;
            var opt_post = false;
            await axios({
                method : "post",
                url : "/api/opt/",
                data : _export_opt,
                headers : {"X-CSRFToken" : pojiloygibon24 }
            }).then(function(resp){
                opt_post = true
            }).catch(function(error){
                console.log(error)
            });  

            if(opt_post == true){
                for(var ind in this.divs_data_exp.data){
                    await axios({
                        method : "post",
                        url : "/api/bbox/",
                        data: {
                            classname: this.divs_data_exp.data[ind].classname,
                            xmin: this.divs_data_exp.data[ind].xmin,
                            xmax: this.divs_data_exp.data[ind].xmax,
                            ymin: this.divs_data_exp.data[ind].ymin,
                            ymax: this.divs_data_exp.data[ind].ymax,
                            keysession: this.filename + this.keysession,
                        },
                        headers : {"X-CSRFToken" : pojiloygibon24 }
                    }).then(function(respp){
                        bbox_post = true;
                    }).catch(function(error){
                        console.log('Bbox error', error)
                        bbox_post = false;
                    });
                }
            }
            
            console.log(bbox_post)

            console.log('Div.stylenames -', this.divs.styleNames)
            this.downloadingg = false;
            return location.href = '/download'+this.filename+this.keysession
        },
        SetDepth(){
            var person = prompt("Пожалуйста введите значение depth", this.depth);
            if (person == null || person == "") {

            }else{
                if (! isNaN(parseInt(person))){
                    this.depth = parseInt(person);
                }       
            }
        },
        SetSegmented(){
            var person = prompt("Пожалуйста введите значение segmented", this.segmented);
            if (person == null || person == "") {

            }else{
                if (! isNaN(parseInt(person))){
                    this.segmented = parseInt(person);
                }       
            }
        },
        SetClassName(){
            var person = prompt("Пожалуйста введите имя класса по умолчанию", this.default_class_name);
            if (person == null || person == "") {

            }else{
                this.default_class_name = person; 
            }
        },
        SetBlur(){
            this.blur_img = !this.blur_img;
            if (this.blur_img == true){
                this.pos.imageRendering = 'auto';
            }else{
                this.pos.imageRendering = 'pixelated';
            }
            
        },
        SetRulerBool(){
            this.rulerBool = !this.rulerBool;
        }
    }
})