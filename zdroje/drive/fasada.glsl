else if(m==8.){vec2 c=uv/vec2(3.2,3.4);vec2 f=fract(c);vec2 fc0=floor(c);vec3 wall=base;float bs=fract(vC.r*91.7+vC.g*37.3+vC.b*13.1);float hh0=fract(sin(dot(mod(fc0,vec2(97.,89.)),vec2(12.9898,78.233)))*437.585);float hb=fract(sin(dot(fc0,vec2(41.3,17.7)))*7531.);
  if(fc0.y>.5){float wx0=bs<.33?.2:bs<.66?.27:.15;float wy0=bs<.5?.22:.17;float wy1=bs<.5?.78:.83;if(f.y<.04)base=wall*.8;float tr=step(wx0-.04,f.x)*step(f.x,1.04-wx0)*step(wy0-.05,f.y)*step(f.y,wy1+.035);float w=step(wx0,f.x)*step(f.x,1.-wx0)*step(wy0,f.y)*step(f.y,wy1);
   if(tr>.5&&w<.5){base=mix(wall,vec3(.82,.81,.77),.8);if(f.y<wy0)base*=.82;}
   if(w>.5){vec2 g=(f-vec2(wx0,wy0))/vec2(1.-2.*wx0,wy1-wy0);float on=step(fract(hh0+floor(uTm/23.+hh0*9.)*.37),.42);base=vec3(.035,.055,.08);spec=1.;shin=80.;env=.16;if(hh0>.5&&g.y>.5){base=vec3(.42,.4,.36);env=.08;spec=.2;}emis=on*uNight*.55;if(on>.5&&uNight>.05)base=vec3(1.,.66,.32)*.75;if(abs(g.x-.5)<.03||abs(g.y-.64)<.022){base=vec3(.78,.77,.73)*(1.-.6*uNight);emis=0.;spec=.1;env=0.;}}
   if(hb>.72&&f.y<.24&&f.y>.02&&f.x>.08&&f.x<.92){base=vec3(.24,.25,.27)*(f.y>.19?1.4:.8+.5*step(.55,fract(f.x*15.)));emis=0.;spec=.6;env=0.;}}
  else if(fc0.y>-.5){float gh=fract(sin(floor(fc0.x*.5)*12.71+bs*31.)*4375.5);vec3 sc=gh<.2?vec3(.3,.09,.07):gh<.4?vec3(.08,.15,.28):gh<.6?vec3(.1,.22,.15):gh<.8?vec3(.36,.26,.1):vec3(.16,.16,.19);base=wall*.92;
   if(f.y<.07){base=vec3(.3,.3,.3);}
   else if(f.y>.79&&f.y<.94){base=sc;emis=uNight*.3;}
   else if(f.y>.7&&f.y<=.79){base=mix(sc,vec3(.9,.88,.82),step(.5,fract(f.x*5.)));}
   else if(hb<.28){if(f.x>.3&&f.x<.7&&f.y<.66){base=vec3(.2,.13,.09);spec=.3;if(f.y>.4&&f.x>.36&&f.x<.64&&f.y<.6){base=vec3(.04,.06,.08);spec=1.;env=.4;emis=uNight*.3;}}}
   else{float sh2=step(.07,f.x)*step(f.x,.93)*step(.15,f.y)*step(f.y,.68);float fr=step(.045,f.x)*step(f.x,.955)*step(.125,f.y);if(sh2>.5){base=vec3(.04,.055,.07);spec=1.2;shin=120.;env=.2;emis=uNight*.45+.03;if(uNight>.05)base=mix(base,vec3(.95,.82,.55),.35);if(abs(f.x-.5)<.012){base=vec3(.12,.12,.13);env=0.;emis=0.;}}else if(fr>.5){base=vec3(.13,.13,.14);}}}}
