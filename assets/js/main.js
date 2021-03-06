var main = function(){
    $('.circle').click(function(){
        $(this).toggleClass('is-active');
        $('.nav').toggleClass('show-nav');
    });
    var KEY_DISTANCES = {
        32: +200, // space
        38: -100, //pageup
        40: +100, //pagedown
        34: +window.innerHeight, //pagedown
        33: -window.innerHeight, //pageup
    };
    $(document).keydown(function (event) {
        if (!!KEY_DISTANCES[event.keyCode]) {
            event.preventDefault();
            TweenMax.to($("html,body"), 1.0, {
                overwrite: "none",
                scrollTop:"+="+KEY_DISTANCES[event.keyCode],
            });

        }
    });

//start scrolling controllers
    var controller = new ScrollMagic.Controller();
    var endPositions, tweensInsideFunnel;
    var w = 620;
    var h = 620/375*541;

    if (window.innerWidth<620){//iPhone
        $("#MazeWrapper svg")
            .attr("width","375px")
            .attr("height","541px")
            .css("margin-top","-4px");
        $("#topAnimationsWrapper").css("height","1600px");
    } else if (window.innerWidth<1207){
        $("#MazeWrapper svg")
            .attr("width",""+w+"px")
            .attr("height",""+h+"px")
            .css("margin-left","-122px")
            .css("margin-top","-40px");
    } else {
        $("#MazeWrapper svg")
            .attr("width",""+w+"px")
            .attr("height",""+h+"px")
            .css("margin-left","-122px")
            .css("margin-top","40px");
    }
    if (window.innerWidth<620){//iPhone
        endPositions={
            left : {x:"25%", y:966},
            right: {x:"28%", y:966},
        };
    } else if(window.innerWidth<1207){
        endPositions={
            left : {x:"38%", y:966},
            right: {x:"42%", y:966},
        };
    } else if (window.innerWidth>1900){
        endPositions={
            left : {x:"45%", y:1066},
            right: {x:"48%", y:1066},
        };
    } else {
        endPositions={
            left : {x:"38%", y:1066},
            right: {x:"42%", y:1066},
        };
    }

    if (window.innerWidth<1207){
        TweenMax.set($("#slideHeader"),{height:"611px","background-position-y":"50px"});
        TweenMax.set($("#roadContainer,#roadContainer2"), {"height":"561px", top:"+=50px"})
        TweenMax.set($(".funnel"), {"margin-top":"0px"})
        TweenMax.set($("h1#funnelTitle"), {"top":"-=100px"})
    }

    tweensInsideFunnel = [
        {icon:".iconShoe.imgHolder",        pos:"right", duration:1.0},//goes out 1st
        {icon:".iconSpeedometer.imgHolder", pos:"left" , duration:1.1},//2nd
        {icon:".iconSun.imgHolder",         pos:"right", duration:1.2},
        {icon:".iconBiker.imgHolder",       pos:"left" , duration:1.35},
        {icon:".iconRun.imgHolder",         pos:"right", duration:1.45},
        {icon:".iconHeartbeat.imgHolder",   pos:"left" , duration:1.55},
        {icon:".iconWaves.imgHolder",       pos:"right", duration:1.75},
        {icon:".iconPeaks.imgHolder",       pos:"left" , duration:1.85},
    ].map(function(settings, index){
        var element = $(settings.icon),
        pos = endPositions[settings.pos]
        iconTweens = [
            TweenMax.to(element, settings.duration, { force3D:true, left: pos.x, ease: Sine.easeOut}),
            TweenMax.to(element, settings.duration, { force3D:true, top : pos.y, ease: Sine.easeIn}),
        ];
        return iconTweens;
    }).reduce(function(last, next){
        return last.concat(next);
    },[]);
    if (window.innerWidth<1207){
        tweensInsideFunnel.push(TweenMax.to($("#slideHeader"),1.3, {"background-position-y":"-=50px"}));//paralax of banner
    }
    var scene = new ScrollMagic.Scene({
        triggerElement: "#roadContainer",
        duration:900,// scroll some pixels to complete the animation
        triggerHook:"onLeave"
    })
    .setTween(new TimelineMax().add(tweensInsideFunnel))
    .addTo(controller);

    // FEATUREs paralax
    [
    {id: "#features .data", startY:"80px", endY:"-78px"},
    {id: "#features .analyze", startY:"125px", endY:"34px"},
    {id: "#features .achieve", startY:"50px", endY:"-78px"},
    ].forEach(function(element, index){
        var tweens = [TweenMax.fromTo($(element.id), 1.0, {
                    'background-position-y': element.startY,
                }, {
                    'background-position-y': element.endY,
                    immediateRender:false
                })];
        if (index===2){//add biker and runner animations
            tweens = tweens.concat([
                TweenMax.to($("#slope-biker"),  1.0,{"margin-top":"-=250", "margin-left":"+=100",immediateRender:false}),
                TweenMax.to($("#slope-runner"), 1.0,{"margin-top":"-=250", "margin-left":"-=100",immediateRender:false}),
            ]);
        }
        var paralaxScene = new ScrollMagic.Scene({
            triggerElement: element.id,
            duration: 1000,
            triggerHook: "onEnter"})
        .setTween(new TimelineMax().add(tweens))
        .addTo(controller);
    });
    [
        // {id:"#MazeWrapper",                     trigger:"#MazeWrapper"   , delay:0.25, tweenTime:0.5, staggerTime:0.3, duration:700},
    // signUp button
        {id:"#signup-button"                 , offset:  0, trigger:"#signup-button" , delay:0   , tweenTime:0.5, staggerTime:0, duration:700},
    // FUTURE RELEASE FEATUREs paralax
        {id:"#future-release>div.left>ul>li" , offset:200, trigger:"#future-release>div.left>ul>li:first-child", delay:0.15, tweenTime:0.4, staggerTime:0.1, duration:300},
        {id:"#future-release>div.right>ul>li", offset:200, trigger:"#future-release>div.right>ul>li:first-child", delay:0.15, tweenTime:0.4, staggerTime:0.1, duration:300},
    ].forEach(function(settings, index){
        var paralaxScene = new ScrollMagic.Scene({
            triggerElement: settings.trigger,
            duration: settings.duration,
            offset: settings.offset||0,
            triggerHook: "onEnter"})
        .setTween(new TimelineMax().staggerFromTo(
            $(settings.id).get(),
            settings.tweenTime,//tween time
            {'opacity': 0.0},//from data
            {'opacity': 1.0, delay:settings.delay},// to data
            settings.staggerTime)//distance between starts,
        )

        .addTo(controller);
    });

    //REQUEST EARLY ACCESS
    [
        {id:"#request-access>div:nth-child(1) div.col-xs-12, #request-access>div:nth-child(2) div.col-xs-12",              trigger:"#request-access", delay:1 , tweenTime:1, staggerTime:0.25, duration:350},
    ].forEach(function(settings, index){
        var self = $(settings.id).get();
        var paralaxScene = new ScrollMagic.Scene({
            triggerElement: settings.trigger,
            duration: settings.duration,
            triggerHook: "onEnter"})
        .setTween(new TimelineMax({tweens:[
            TweenMax.staggerFromTo(
                self,
                settings.tweenTime,//tween time
                {'opacity': 0.0},//from data
                {'opacity': 1.0, delay:settings.delay},// to data
                settings.staggerTime),//distance between starts,
            TweenMax.fromTo(
                self,
                settings.tweenTime,//tween time
                {'top': 25.0},//from data
                {'top': 0.0, delay:settings.delay*2},// to data
                settings.staggerTime),//distance between starts,
            ]})
        )

        .addTo(controller);
    });


    //MAZE animations

    var MAZEscene = new ScrollMagic.Scene({
        triggerElement: "#MazeWrapper",
        duration: (window.innerWidth<620)?300:630, // sliding those number of pixels to complete the MAZE animation
        triggerHook: "onEnter",
        offset:150 // wait to pass offset pixel before starting with the SVGdraw
    });

    var timeLine = new TimelineMax()
        .set($("g>path"), {drawSVG:"0% 0%"});

    var sequence = [// if you change the svg config the elements below:
        {elem:$("g#_x37_>path"),  back:false, debugColor:"pink"},
        {elem:$("g#_x38_>path"),  back:false, debugColor:"black"},
        {elem:$("g#_x35_>path"),  back:true , debugColor:"brown"},
        {elem:$("g#_x34_>path"),  back:true , debugColor:"gray"},
        {elem:$("g#_x33_>path"),  back:true , debugColor:"purple", delay:30, time:120},
        {elem:$("g#_x32_>path"),  back:true , debugColor:"magenta", delay:0, time:40},
        {elem:$("g#_x31_>path"),  back:false, debugColor:"cyan"},
        {elem:$("g#_x31_0>path"), back:false, debugColor:"yellow", delay:0, time:45},
        {elem:$("g#_x31_2>path"), back:false, debugColor:"red",delay:55, time:26},
        {elem:$("g#_x31_1>path"), back:false, debugColor:"blue",delay:65, time:50},
        {elem:$("g#_x39_>path"),  back:false, debugColor:"green",delay:48, time:50},
    ].map(function(cfg){
      var self = cfg.elem;
      
      if (cfg.back){//some lines might be have drawn the reversed direction
        return TweenMax.fromTo(self, cfg.time||150, {drawSVG:"0% 0%"}, {
            drawSVG:"0% 100%",
            delay:cfg.delay||0,
            immediateRender:false,//prevents from starting the animation until added to TimeLine 
            }); //back:true
      } else {
        return TweenMax.fromTo(self, cfg.time||150, {drawSVG:"100% 100%"}, {
            drawSVG:"0% 100%",
            delay:cfg.delay||0,
            immediateRender:false,//prevents from starting the animation until added to TimeLine 
            }); //back:false
      }
    });




    // THUMBLERS animations
    thumblers = [
        {delay:0, rotation: -150, time:45, index:1},
        {delay:0, rotation:   60, time:25, index:2},
        {delay:0, rotation:   90, time:55, index:3},
        {delay:0, rotation: -150, time:67, index:4},
        {delay:0, rotation:  170, time:55, index:5},
        {delay:0, rotation:  -90, time:29, index:6},
        {delay:0, rotation:  140, time:70, index:7},
        {delay:0, rotation:  -70, time:15, index:8},
        ].map(function(settings ){
        var self = $("g#clock"+(settings.index));
        return TweenMax.to(self, settings.time, {
            rotation:settings.rotation,
            transformOrigin:"50% 50%",
            delay:settings.delay,
            immediateRender:false,//prevents from starting the animation until added to TimeLine 
            onUpdate:function(){
                self.children().attr("stroke","#ED684B");
            },
            onComplete:function(){
                self.children().attr("stroke","#73C2A9");
            }
            }); //back:true
    });

    timeLine.add(sequence.concat(thumblers));//.restart();

    // add LOGO animation
    timeLine.add(TweenMax.staggerFromTo($("g#logo1,g#logo2,g#logo3"),30,{opacity:1},{opacity:0,immediateRender:false}, 30), "-=100");
    MAZEscene.setTween(timeLine).addTo(controller);
    //end MAZE animations


    // CIRCLE bars EVENT FORECAST

    [
     {parent:"div.red-circle"  , percent:78, image:"circularBarRed.png"},
     {parent:"div.blue-circle" , percent:100, image:"circularBarBlue.png"},
     {parent:"div.green-circle", percent:90, image:"circularBarGreen.png"},

    ].forEach(function(settings){
        var scene = new ScrollMagic.Scene({
            triggerElement: settings.parent,
            duration:450,
            triggerHook:"onEnter",
            offset:150
        })
        .setTween(new CircleAnimation(settings).timeLine)
        .addTo(controller);
    });
};
var loadingFX = function(callback){
    var startElements = $([
        "#topTitle",
        ".roadiconsDark",
        ".roadiconsDark svg",
        ".roadicons",
        ".roadicons svg"
        ].join(", ")).get();
    var onLoadTL = new TimelineMax({delay:0.3})
        .set($("html,body"),{scrollTop:0})
        .set($("#roadContainer,#roadContainer2"), {opacity:1})
        .add([
            TweenMax.fromTo($("#header").get(), 1.5, {opacity:0, "margin-top":"-=50px", "margin-bottom":"+=50px"},{opacity:1, "margin-top":"+=50px", "margin-bottom":"-=50px"}),
            TweenMax.fromTo(startElements, 1.5, {opacity:0, top:"-=50px"},{opacity:1, top:"+=50px"})
        ])
        .addCallback(function(){
            callback && callback();
        });


};
$(document).ready(function(){
    // scroll animation
    var scroll_speed = Math.abs( $("#signup").offset().top -
        $('div#signup-button .button-orange>a').offset().top
    ) / 1000; // short scroll time
    $('a[href^="#"]').on('click', function(event) {
        var target = $( $(this).attr('href') );
        var start_pos = $(this).offset().top;
        var target_pos = target.offset().top;
        var distance = Math.abs(target_pos - start_pos);

        if( target.length ) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target_pos
            }, Math.floor(distance / scroll_speed),
            "swing",//easing
            function(){//callback
                if (target.selector==="#signup"){
                    document.getElementById("signup_name").focus();
                }
            });
        }
    });

    var $bgobj = $("#slideHeader") // assigning the object

    $(window).scroll(function() {
        var yPos = -($(window).scrollTop() / 3); 
        
        // Put together our final background position
        var coords = '50% '+ yPos + 'px';

        // Move the background
        $bgobj.css({ backgroundPosition: coords });
    });
    $("html,body").animate({scrollTop:"+=1"},200);




    var imagesToEmbed = jQuery('img.svg');
    var afterN = imagesToEmbed.size();
    var wrapAfter = function(){
        afterN -= 1;
        if (!afterN){
            loadingFX(main);
        }
    };
    imagesToEmbed.each(function(){
        // <img> with svg source to embedded svgs. http://stackoverflow.com/a/24933495 -->

        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);


            wrapAfter();
        }, 'xml');

    });

});