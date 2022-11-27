varying float vNoise;
varying vec2 vUv;
uniform sampler2D uImage;
// uniform float time;
uniform float hoverState;
uniform float cursorPositionX;
uniform float cursorPositionY;
uniform float aniInOut;


void main()	{ // gallery

    vec2 newUV = vUv;

    float rgbWithHover =  1. - ( 0.3 * aniInOut / 5. );

    vec4 imageView = texture2D( uImage , newUV ) * vec4( rgbWithHover , rgbWithHover , rgbWithHover, (1. * aniInOut) );

    gl_FragColor = imageView;
    gl_FragColor.rgb -= 0.15*vec3(vNoise);
}
