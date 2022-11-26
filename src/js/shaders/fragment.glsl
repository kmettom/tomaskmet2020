varying float vNoise;
varying vec2 vUv;
uniform sampler2D uImage;
uniform float time;
uniform float hoverState;
uniform float aniInOut;



void main()	{

    vec2 newUV = vUv;

    vec2 p = newUV;
    float x = aniInOut;
    x = smoothstep(.0,1.0,(x*2.0+p.y-1.0));
    vec4 f = mix(
        texture2D(uImage, ( p - .9 ) * ( 1. - (x) ) + .9),
        texture2D(uImage, ( p - .9 ) * (x) + .9),
        // texture2D(uImage, ( p - .5 ) * ( 1. - x ) + .5),
        // texture2D(uImage, ( p - .5 ) * x + .5),
        x
        )
        * vec4( 1. , 1. , 1. , (1. * aniInOut) );


    gl_FragColor = f;
    gl_FragColor.rgb += 0.01*vec3(vNoise);


}
