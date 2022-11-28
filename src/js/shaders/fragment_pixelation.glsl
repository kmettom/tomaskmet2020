uniform sampler2D tex;

void main()
{
 float dx = 15.*(1./512.);
 float dy = 10.*(1./512.);
 vec2 coord = vec2(dx*floor(gl_TexCoord.x/dx),
                   dy*floor(gl_TexCoord.y/dy));
 gl_FragColor = texture2D(tex, coord);
}
