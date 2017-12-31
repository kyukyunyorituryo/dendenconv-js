//ファイル配列オブジェクト
//読み込んだファイルを格納
//FO = [{file_id:"",file_name:'cover.jpg',data:'',type:'image/jpeg'}];
var txtFO= [];
var imgFO= [];
var markFO=[];
//表紙画像オブジェクト
var coverFO= {file_id:"cover",file_name:'',data:'',type:''};
//xhtml出力用
var pages=[];
//UUID宣言
//uuid ver.4
var objV4 = UUID.genV4();
//イメージモーダル
function pop(self) {
          $('#imagepreview').attr('src', $(self).attr('src'));
          $('#imagepreview').attr('title', $(self).attr('title'));
          $('#imagemodal').modal('show');
      }
//表紙画像選択
 function CoverFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '" onclick="pop(this) "/>'].join('');
        if (document.getElementById('coverthumb').hasChildNodes()) { 
        document.getElementById('coverthumb').replaceChild(span,document.getElementById('coverthumb').firstChild);}
         else { document.getElementById('coverthumb').insertBefore(span, null);}
          coverFO=({file_name:theFile.name,data:e.target.result,type:theFile.type});
          if(coverFO.type=="image/jpeg"){coverFO.ext="jpg"};
	if(coverFO.type=="image/png"){coverFO.ext="png"};
	//チェックコード
var image =new Image();
image.src = e.target.result;
image.onload = function() {
console.log(image.width);
console.log(image.height);
document.getElementById("imgwidth").value=image.width;
document.getElementById("imgheight").value=image.height;

};
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('coverfile').addEventListener('change', CoverFileSelect, false);});
//ここまで表紙画像

//ここから本文
//連続ファイル読み込み
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {

//画像ファイルとテキストファイルの判別
if (!f.type.match('image.*') && !f.type.match('text.*')) {
        continue;
      }
   if (f.type.match('image.*')) {
       var reader = new FileReader();
        // ファイル読取が完了した際に呼ばれる処理
        reader.onload = (function (evt) {
                return function(e) {
                          imgFO.push({file_name:evt.name,type:evt.type,data:e.target.result});
        }
      })(f);
        // readAsDataURLメソッドでファイルの内容を取得
        reader.readAsDataURL(f);
      }
   if (f.type.match('text.*')) {
       var reader = new FileReader();
        // ファイル読取が完了した際に呼ばれる処理
        reader.onload = (function (evt) {
                return function(e) {
                          txtFO.push({file_name:evt.name,type:evt.type,data:e.target.result});

        }
      })(f);
        // readAsTextメソッドでファイルの内容を取得
        reader.readAsText(f);
      }
    
      output.push('<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');

    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

  }
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  });
//ページ分割して格納
function splitmarkdown(textFO) {
text=txtFO[0].data;
 markFO = text.split(/^={3,}$/gm);
 console.log(markFO)
}
 
//EPUB３テンプレート
var containerXML ='<?xml version="1.0" encoding="UTF-8"?>\n<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n<rootfiles>\n<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n</rootfiles>\n</container>';
var standardOPF = '<?xml version="1.0" encoding="UTF-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="identifier0" version="3.0" prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/">\n<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n<dc:identifier id="identifier0">urn:uuid:0ecb8661-1eca-4685-8c3b-e0f67b9d1c96</dc:identifier>\n<meta refines="#identifier0" property="identifier-type" scheme="xsd:string">uuid</meta>\n<dc:title id="title0">タイトル</dc:title>\n<meta refines="#title0" property="display-seq">1</meta>\n<dc:creator id="creator0">著者</dc:creator>\n<meta refines="#creator0" property="display-seq">1</meta>\n<dc:format>application/epub+zip</dc:format>\n<dc:language>ja</dc:language>\n<meta property="ibooks:specified-fonts">true</meta>\n<meta property="dcterms:modified">時間</meta>\n<meta name="cover" content="_cover.png" />\n</metadata>\n<manifest>\n<item media-type="image/png" href="cover.png" id="_cover.png" properties="cover-image" />\n<item media-type="text/css" href="template.css" id="_template.css" />\n<item media-type="text/css" href="style.css" id="_style.css" />\n<item media-type="application/xhtml+xml" href="cover.xhtml" id="_cover.xhtml" properties="svg" />\n<item media-type="application/xhtml+xml" href="nav.xhtml" id="_nav.xhtml" properties="nav" />\n<item media-type="application/xhtml+xml" href="bodymatter_0_0.xhtml" id="_bodymatter_0_0.xhtml" />\n<item media-type="image/png" href="fig01.png" id="_fig01.png" />\n<item media-type="application/x-dtbncx+xml" href="toc.ncx" id="_toc.ncx" />\n</manifest>\n<spine page-progression-direction="rtl" toc="_toc.ncx">\n<itemref idref="_cover.xhtml" linear="no" />\n<itemref idref="_nav.xhtml" />\n<itemref idref="_bodymatter_0_0.xhtml" />\n</spine>\n<guide>\n<reference type="cover" title="表紙" href="cover.xhtml" />\n<reference type="toc" title="目次" href="nav.xhtml" />\n<reference type="text" title="本文" href="bodymatter_0_0.xhtml" />\n</guide>\n</package>';
//var kindleOPF ='<?xml version="1.0" encoding="utf-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" xml:lang="ja" unique-identifier="unique-id" prefix="rendition: http://www.idpf.org/vocab/rendition/# ebpaj: http://www.ebpaj.jp/" >\n<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n<!-- 作品名 -->\n<dc:title id="title">作品名１</dc:title>\n<meta refines="#title" property="file-as">セイレツヨウサクヒンメイカナ01</meta>\n<!-- 著者名 -->\n<dc:creator id="creator01">著作者名１</dc:creator>\n<meta refines="#creator01" property="role" scheme="marc:relators">aut</meta>\n<meta refines="#creator01" property="file-as"> セイレツヨウチョサクシャメイカナ 01</meta>\n<meta refines="#creator01" property="display-seq">1</meta>\n<dc:creator id="creator02">著作者名２</dc:creator>\n<meta refines="#creator02" property="role" scheme="marc:relators">aut</meta>\n<meta refines="#creator02" property="file-as"> セイレツヨウチョサクシャメイカナ 02</meta>\n<meta refines="#creator02" property="display-seq">2</meta>\n<!-- 出版社名 -->\n<dc:publisher id="publisher">出版社名</dc:publisher>\n<meta refines="#publisher" property="file-as"> セイレツヨウシュッパンシャメイカナ</meta>\n<!-- 言語 -->\n<dc:language>ja</dc:language>\n<!-- ファイルid -->\n<dc:identifier id="unique-id">urn:uuid:860ddf31-55a4-449a-8cc9-3c1837657a15</dc:identifier>\n<!-- 更新日 -->\n<meta property="dcterms:modified">2012-01-01T00:00:00Z</meta>\n<!-- Fixed-Layout Documents指定 -->\n<meta name="original-resolution" content="600x837" />\n<meta name="primary-writing-mode" content="horizontal-rl" />\n<meta name="book-type" content="comic" />\n<meta content="true" name="zero-gutter" />\n<meta content="true" name="zero-margin" />\n<meta content="none" name="orientation-lock" />\n<meta content="true" name="fixed-layout" />\n<meta content="false" name="region-mag" />\n<!-- etc. -->\n<meta property="ebpaj:guide-version">1.1</meta>\n</metadata>\n<manifest>\n<!-- navigation -->\n<item media-type="application/xhtml+xml" id="toc" href="nav.xhtml" properties="nav"/>\n<item media-type="application/x-dtbncx+xml" id="ncxtoc" href="toc.ncx"/>\n<!-- style -->\n<item media-type="text/css" id="fixed-layout-jp" href="style/fixed-layout-jp.css"/>\n<!-- image -->\n<item media-type="image/jpeg" id="cover" href="image/cover.jpg" properties="cover-image"/>\n<!-- xhtml -->\n<item media-type="application/xhtml+xml" id="p-cover" href="xhtml/p-cover.xhtml" properties="svg" fallback="cover"/>\n</manifest>\n<spine toc="ncxtoc" page-progression-direction="rtl">\n<itemref linear="yes" idref="p-cover" properties="rendition:page-spread-center"/>\n</spine>\n</package>';
//ナビゲーション
var navigation= '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:ibooks="http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0" epub:prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0" xml:lang="ja" lang="ja">\n    <head>\n        <meta charset="utf-8" />\n        <link rel="stylesheet" href="style.css" type="text/css" />\n\n        <title>タイトル</title>\n        <style type="text/css">\nnav ol {list-style-type: none;}\n</style>\n    </head>\n    <body class="frontmatter" epub:type="frontmatter">\n        <nav id="toc" class="toc" epub:type="toc">\n<h2>目次</h2>\n<ol>\n<li>\n<a href="bodymatter_0_0.xhtml#toc_index_1"><span>このコンテンツについて</span></a></li>\n<li><a href="bodymatter_0_1.xhtml#toc_index_1"><span>一</span></a></li>\n</ol>\n</nav>\n<nav id="landmarks" class="landmarks" epub:type="landmarks" hidden="hidden">\n<h2>ガイド</h2>\n<ol>\n<li><a epub:type="cover" href="cover.xhtml"><span>表紙</span></a></li>\n<li><a epub:type="toc" href="nav.xhtml"><span>目次</span></a></li>\n<li><a epub:type="bodymatter" href="bodymatter_0_0.xhtml"><span>本文</span></a></li>\n</ol>\n</nav>\n    </body>\n</html>';
//カバーHTML
var coverxhtml='<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja" lang="ja">\n    <head>\n        <meta charset="utf-8" />\n        <meta name="viewport" content="width=744,height=1052" />\n        <title>タイトル</title>\n        <style type="text/css">\n            html { -epub-writing-mode: horizontal-tb; writing-mode: horizontal-tb;}\n            html, body { margin: 0; padding: 0; width: 100%; height: 100%;}\n        </style>\n    </head>\n    <body class="cover" epub:type="cover" title="タイトル">\n        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n            xmlns:xlink="http://www.w3.org/1999/xlink"\n            width="100%" height="100%" viewBox="0 0 744 1052">\n            <image width="744" height="1052" xlink:href="cover.png"/>\n        </svg>\n    </body>\n</html>\n';
//ページHTML
var pagexhtml='<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja" lang="ja">\n    <head>\n        <meta charset="utf-8" />\n        \n        <link rel="stylesheet" href="style.css" type="text/css" />\n\n        <title>黒船前後</title>\n    </head>\n</html>';
//NCX
var ncx='<?xml version="1.0" encoding="UTF-8"?>\n<ncx xmlns:ncx="http://www.daisy.org/z3986/2005/ncx/"\n    xmlns="http://www.daisy.org/z3986/2005/ncx/"\n    version="2005-1"\n    xml:lang="ja">\n    <head>\n        <meta name="dtb:uid" content="urn:uuid:0ecb8661-1eca-4685-8c3b-e0f67b9d1c96"/>\n        <meta name="dtb:depth" content="1"/>\n        <meta name="dtb:totalPageCount" content="0"/>\n        <meta name="dtb:maxPageNumber" content="0"/>\n    </head>\n    <docTitle>\n        <text>黒船前後</text>\n    </docTitle>\n    <navMap>\n<navPoint id="bodymatter_0_0.xhtml__toc_index_1" playOrder="1">\n<navLabel>\n<text>このコンテンツについて</text>\n</navLabel>\n<content src="bodymatter_0_0.xhtml#toc_index_1" />\n</navPoint>\n</navMap>\n</ncx>';
//CSS
var css_style='@charset "UTF-8";\n/* でんでんコンバーター縦書きデフォルト */\n@namespace "http://www.w3.org/1999/xhtml";\n@namespace epub "http://www.idpf.org/2007/ops";\nhtml {\n  -ms-writing-mode: tb-rl;\n  -epub-writing-mode: vertical-rl;\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: vertical-rl;\n  font-family: serif, sans-serif;\n}\n\nbody {\n  text-align: justify;\n  text-justify: inter-ideograph;\n  vertical-align: baseline;\n  word-wrap: break-word;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: serif, sans-serif;\n  font-weight: normal;\n  color: inherit;\n}\n\nh1 {\n  font-size: 2em;\n  margin-right: 0.625em;\n  margin-left: 0.625em;\n}\n\nh2 {\n  font-size: 1.5em;\n  margin-right: 0.83333em;\n  margin-left: 0.83333em;\n}\n\nh3 {\n  font-size: 1.125em;\n  margin-right: 1.11111em;\n  margin-left: 1.11111em;\n}\n\nh4 {\n  font-size: 1em;\n  margin-right: 1.25em;\n  margin-left: 1.25em;\n}\n\nh5 {\n  font-size: 0.875em;\n  margin-right: 1.42857em;\n  margin-left: 1.42857em;\n}\n\nh6 {\n  font-size: 0.75em;\n  margin-right: 1.66667em;\n  margin-left: 1.66667em;\n}\n\np {\n  margin-right: 1.25em;\n  margin-left: 1.25em;\n  line-height: 1.8;\n}\n\np, li, dt, dd {\n  line-height: 1.8;\n}\n\nb, strong, dt, caption, figcaption, th {\n  font-family: sans-serif, serif;\n}\n\nblockquote, ul,\nfieldset, form,\nol, dl, menu {\n  margin-right: 1.25em;\n  margin-left: 1.25em;\n  padding: 0;\n}\n\nblockquote blockquote, blockquote ol, blockquote ul, blockquote dl, ol blockquote, ol ol, ol ul, ol dl, ul blockquote, ul ol, ul ul, ul dl, dl blockquote, dl ol, dl ul, dl dl {\n  margin-right: 0em;\n  margin-left: 0em;\n}\n\nol, ul, menu, dd {\n  margin-top: 2em;\n}\n\na {\n  color: #0538b2;\n}\na:hover {\n  color: #b2058e;\n}\na:active {\n  color: #b27f05;\n}\n\npre {\n  white-space: pre-wrap;\n}\n\nimg {\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: 100%;\n}\n\nhr {\n  margin-right: 1.25em;\n  margin-left: 1.25em;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\nrt {\n  font-family: serif, sans-serif;\n}\n\n.tcy {\n  -epub-text-combine: horizontal;\n  -webkit-text-combine: horizontal;\n  -ms-text-combine-horizontal: all;\n  text-combine-horizontal: all;\n  text-combine-upright: all;\n}\n\n.sideways {\n  -epub-text-orientation: sideways;\n  text-orientation: sideways;\n}\n\n.upright {\n  -epub-text-orientation: rotate-right;\n  -epub-text-orientation: upright;\n  -webkit-text-orientation: upright;\n  -epub-text-combine: horizontal;\n  -webkit-text-combine: horizontal;\n  -ms-text-combine-horizontal: all;\n  text-combine-horizontal: all;\n  text-combine-upright: all;\n}\n\n.pagenum {\n  color: gray;\n  font-size: 0.8em;\n}\n\n.footnotes hr {\n  margin-right: 1.25em;\n  margin-left: 1.25em;\n}\n.footnotes ol {\n  margin-top: 2em;\n}\n.footnotes li {\n  font-size: 0.875em;\n}\n\na.noteref {\n  display: inline-block;\n  border: none;\n  font-size: 0.75em;\n  line-height: 1;\n  vertical-align: super;\n  -epub-text-combine: horizontal;\n  -webkit-text-combine: horizontal;\n  -ms-text-combine-horizontal: all;\n  text-combine-horizontal: all;\n  text-combine-upright: all;\n}\na.noteref:before {\n  content: "[";\n}\na.noteref:after {\n  content: "]";\n}\n\nnav#toc, nav#landmarks, nav#loi, nav#lot, nav#page-list {\n  margin-left: 2.5em;\n}\nnav#toc ol, nav#landmarks ol, nav#loi ol, nav#lot ol, nav#page-list ol {\n  margin-top: 1em;\n}\n\n.-epub-media-overlay-active {\n  background-color: yellow;\n}\n\nh2 {\n  margin-top: 0.66667em;\n}\n\nh3 {\n  margin-top: 1.77778em;\n}\n\nh4 {\n  margin-top: 3em;\n  font-family: sans-serif, serif;\n}\n\nblockquote {\n  margin-top: 1em;\n}\n\np {\n  margin: 0;\n}\n\na {\n  text-decoration: overline;\n}\n\nu {\n  text-decoration: overline;\n}\n\nem {\n  font-style: normal;\n  -epub-text-emphasis-style: filled sesame;\n  text-emphasis-style: filled sesame;\n}\n\n.text-left           { text-align: left; }\n.text-right          { text-align: right; }\n.text-center         { text-align: center; }\n.text-justify        { text-align: justify; }\n.text-pre-wrap       { white-space: pre-wrap; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n\n.sr-only {\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0,0,0,0);\n  white-space: nowrap;\n  clip-path: inset(50%);\n  border: 0;\n}\n\n@media print {\n  h1 {\n    page-break-before: always;\n  }\n\n  h1, h2, h3,\n  h4, h5, h6 {\n    page-break-after: avoid;\n  }\n\n  ul, ol, dl {\n    page-break-before: avoid;\n  }\n}\n';

var css_templete='@charset "UTF-8";\n/* でんでんコンバーターテンプレート用 */\n@namespace "http://www.w3.org/1999/xhtml";\n@namespace epub "http://www.idpf.org/2007/ops";\nhtml {\n  -ms-writing-mode: lr-tb;\n  -epub-writing-mode: horizontal-tb;\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: horizontal-tb;\n  font-family: sans-serif, serif;\n}\n\nbody {\n  text-align: justify;\n  text-justify: inter-ideograph;\n  vertical-align: baseline;\n  word-wrap: break-word;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: inherit;\n  font-weight: bold;\n  color: inherit;\n}\n\nh1 {\n  font-size: 2em;\n  margin-top: 0.625em;\n  margin-bottom: 0.625em;\n}\n\nh2 {\n  font-size: 1.5em;\n  margin-top: 0.83333em;\n  margin-bottom: 0.83333em;\n}\n\nh3 {\n  font-size: 1.125em;\n  margin-top: 1.11111em;\n  margin-bottom: 1.11111em;\n}\n\nh4 {\n  font-size: 1em;\n  margin-top: 1.25em;\n  margin-bottom: 1.25em;\n}\n\nh5 {\n  font-size: 0.875em;\n  margin-top: 1.42857em;\n  margin-bottom: 1.42857em;\n}\n\nh6 {\n  font-size: 0.75em;\n  margin-top: 1.66667em;\n  margin-bottom: 1.66667em;\n}\n\np {\n  margin-top: 1.25em;\n  margin-bottom: 1.25em;\n  line-height: 1.8;\n}\n\np, li, dt, dd {\n  line-height: 1.8;\n}\n\nb, strong, dt, caption, figcaption, th {\n  font-family: sans-serif, serif;\n}\n\nblockquote, ul,\nfieldset, form,\nol, dl, menu {\n  margin-top: 1.25em;\n  margin-bottom: 1.25em;\n  padding: 0;\n}\n\nblockquote blockquote, blockquote ol, blockquote ul, blockquote dl, ol blockquote, ol ol, ol ul, ol dl, ul blockquote, ul ol, ul ul, ul dl, dl blockquote, dl ol, dl ul, dl dl {\n  margin-top: 0em;\n  margin-bottom: 0em;\n}\n\nol, ul, menu, dd {\n  margin-left: 2em;\n}\n\na {\n  color: #0538b2;\n}\na:hover {\n  color: #b2058e;\n}\na:active {\n  color: #b27f05;\n}\n\npre {\n  white-space: pre-wrap;\n}\n\nimg {\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: 100%;\n}\n\nhr {\n  margin-top: 1.25em;\n  margin-bottom: 1.25em;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\nrt {\n  font-family: serif, sans-serif;\n}\n\n.tcy {\n  -epub-text-combine: horizontal;\n  -webkit-text-combine: horizontal;\n  -ms-text-combine-horizontal: all;\n  text-combine-horizontal: all;\n  text-combine-upright: all;\n}\n\n.sideways {\n  -epub-text-orientation: sideways;\n  text-orientation: sideways;\n}\n\n.upright {\n  -epub-text-orientation: rotate-right;\n  -epub-text-orientation: upright;\n  -webkit-text-orientation: upright;\n  -epub-text-combine: horizontal;\n  -webkit-text-combine: horizontal;\n  -ms-text-combine-horizontal: all;\n  text-combine-horizontal: all;\n  text-combine-upright: all;\n}\n\n.pagenum {\n  color: gray;\n  font-size: 0.8em;\n}\n\n.footnotes hr {\n  margin-top: 1.25em;\n  margin-bottom: 1.25em;\n}\n.footnotes ol {\n  margin-left: 2em;\n}\n.footnotes li {\n  font-size: 0.875em;\n}\n\na.noteref {\n  display: inline-block;\n  border: none;\n  font-size: 0.75em;\n  line-height: 1;\n  vertical-align: super;\n  -epub-text-combine: horizontal;\n  -webkit-text-combine: horizontal;\n  -ms-text-combine-horizontal: all;\n  text-combine-horizontal: all;\n  text-combine-upright: all;}\na.noteref:before {\n  content: "[";\n}\na.noteref:after {\n  content: "]";\n}\n\nnav#toc, nav#landmarks, nav#loi, nav#lot, nav#page-list {\n  margin-bottom: 2.5em;\n}\nnav#toc ol, nav#landmarks ol, nav#loi ol, nav#lot ol, nav#page-list ol {\n  margin-left: 1em;\n}\n\n.-epub-media-overlay-active {\n  background-color: yellow;\n}\n\nbody.cover .container img {\n  width: 100%;\n}\n\nbody.titlepage .container img {\n  width: 100%;\n}\n\n.titlepage {\n  margin: 0 auto;\n  width: 100%;\n  text-align: center;\n}\n\n.titlepage .titlepage-container {\n  display: inline-block;\n  text-align: center;\n  margin: 0 auto;\n  padding: 1.25em;\n  min-width: 80%;\n}\n\n.titlepage-collectiontitle {\n  margin: 0;\n  font-size: 0.875em;\n  line-height: 1.25;\n  font-family: sans-serif, serif;\n  margin-top: 1.42857em;\n  padding-top: 0em;\n  padding-bottom: 0em;\n  margin-bottom: 1.42857em;\n  color: #999;\n}\n\n.titlepage-collectiontitle-placeholder {\n  min-height: 1.09375em;\n  margin-top: 1.42857em;\n  padding-top: 0em;\n  padding-bottom: 0em;\n  margin-bottom: 1.42857em;\n}\n\n.titlepage-maintitle {\n  margin: 0;\n  font-size: 1.5em;\n  line-height: 1.2;\n  font-weight: normal;\n}\n\n.titlepage-subtitle {\n  margin: 0;\n  font-size: 1.125em;\n  line-height: 1.25;\n  margin-top: 1.11111em;\n  padding-top: 0em;\n  padding-bottom: 0em;\n  margin-bottom: 1.11111em;\n}\n\n.titlepage-subtitle-placeholder {\n  min-height: 1.40625em;\n  margin-top: 1.11111em;\n  padding-top: 0em;\n  padding-bottom: 0em;\n  margin-bottom: 1.11111em;\n}\n\n.titlepage-creator {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n  line-height: 1.5;\n  font-family: serif, sans-serif;\n}\n\n.titlepage-creator-placeholder {\n  min-height: 1.5em;\n  margin-top: 1.25em;\n  padding-top: 0em;\n  padding-bottom: 0em;\n  margin-bottom: 1.25em;\n}\n\n.titlepage-publisher {\n  font-size: 0.875em;\n  line-height: 1.42857em;\n  margin-top: 2.85714em;\n  padding-top: 0em;\n  padding-bottom: 0em;\n  margin-bottom: 1.42857em;\n}\n\n.colophon-container {\n  text-align: center;\n  margin: 1em;\n}\n\n.colophon {\n  padding: 1em;\n  min-width: 80%;\n  display: inline-block;\n  text-align: center;\n}\n.colophon p {\n  margin: 0;\n}\n\n.colophon .titles {\n  min-width: 100%;\n  margin-top: 1.25em;\n  padding-top: 0.3125em;\n  padding-bottom: 0.3125em;\n  margin-bottom: 0em;\n  border-bottom: 1px solid #999;\n}\n\n.colophon .main-title {\n  font-size: 1em;\n  line-height: 1.25em;\n  font-weight: bold;\n}\n\n.colophon .collection-title {\n  font-size: 0.875em;\n  line-height: 1.42857em;\n}\n\n.colophon .subtitle {\n  font-size: 0.875em;\n  line-height: 1.42857em;\n  font-family: sans-serif, serif;\n}\n\n.colophon .creators {\n  margin-top: 0em;\n  padding-top: 0.3125em;\n  padding-bottom: 0.3125em;\n  margin-bottom: 0em;\n}\n\n.colophon .publishers {\n  margin-top: 0em;\n  padding-top: 0.3125em;\n  padding-bottom: 0.3125em;\n  margin-bottom: 0em;\n}\n\n.colophon .publisher {\n  font-size: 1em;\n  line-height: 1.25em;\n}\n\n.colophon .copyright-div {\n  font-size: 1em;\n  line-height: 1.25em;\n  margin-top: 0em;\n  padding-top: 0.3125em;\n  padding-bottom: 0.3125em;\n  margin-bottom: 0em;\n  border-top: 1px solid #999;\n}\n\n.colophon .copyright {\n  font-size: 0.75em;\n  line-height: 1.66667em;\n  font-style: italic;\n}\n\n.colophon .isbn {\n  font-size: 0.75em;\n  line-height: 1.66667em;\n}\n\n.colophon dl {\n  margin-top: 0em;\n  padding-top: 0.3125em;\n  padding-bottom: 0.3125em;\n  margin-bottom: 0em;\n}\n\n.colophon dd {\n  margin: 0;\n}\n\n.text-left           { text-align: left; }\n.text-right          { text-align: right; }\n.text-center         { text-align: center; }\n.text-justify        { text-align: justify; }\n.text-pre-wrap       { white-space: pre-wrap; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n\n.sr-only {\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0,0,0,0);\n  white-space: nowrap;\n  clip-path: inset(50%);\n  border: 0;\n}\n\n@media print {\n  h1 {\n    page-break-before: always;\n  }\n\n  h1, h2, h3,\n  h4, h5, h6 {\n    page-break-after: avoid;\n  }\n\n  ul, ol, dl {\n    page-break-before: avoid;\n  }\n}\n';
//EPUB3テンプレートの書換え　DOMParserを使って書き換える。

function rewriteOPF(){
//キンドルの場合kindleOPF、それ以外はstandardOPFに設定する。
//var flag = document.getElementById("radio1").checked;
//if(flag){standardOPF=kindleOPF};


//OPFファイルの書換
var standardOPFxml = (new DOMParser()).parseFromString(standardOPF, 'text/xml');
//縦書き横書き
/*
if (document.getElementById("binding-ltr").checked){
standardOPFxml.querySelector("spine").setAttribute("page-progression-direction","ltr");}
*/

//タイトル
//jqueryからvanilla.jsに
//standardOPFxml.getElementById('title0').textContent=$("#title").val();
standardOPFxml.getElementById('title0').textContent=document.getElementById("title").value;

//著者１
//jquery
//standardOPFxml.getElementById('creator0').textContent=$("#author1").val();
standardOPFxml.getElementById('creator0').textContent=document.getElementById("author1").value;
//ファイルID、uuid
standardOPFxml.getElementById('identifier0').textContent=objV4.urn;
//日時
var today = new Date();
standardOPFxml.querySelector("meta[property='dcterms:modified']").textContent=today.toISOString().slice(0,19)+"Z";


//manifest image
//media-type="image/jpeg" id="i-001" href="image/i-001.jpg"
var imgdf = standardOPFxml.createDocumentFragment();
/*
var ele = standardOPFxml.createElement("item");
	ele.setAttribute("media-type", "image/jpeg");
	ele.setAttribute("id", "i-002");
	ele.setAttribute("href", "image/i-002.jpg");
*/
//繰り返し用
for (j = 0; j < imgFO.length; j++){
imgFO[j].id="i-"+ ('0000' + (j+1) ).slice( -3 );
if(imgFO[j].type=="image/jpeg"){imgFO[j].ext="jpg"};
if(imgFO[j].type=="image/png"){imgFO[j].ext="png"};
//svg: "image/svg+xml"
//var item='\n<item media-type="image/jpeg" id="i-001" href="image/i-001.jpg"/>'
//var itemxml = (new DOMParser()).parseFromString(item, 'text/xml');
//var ele= standardOPFxml .importNode(itemxml.getElementById('i-001') , true);
var	reference = standardOPFxml.getElementById('cover');
var ele = reference.cloneNode(true);
//	var ele = standardOPFxml.createElement("item");
	ele.setAttribute("media-type", imgFO[j].type);
	ele.setAttribute("id", imgFO[j].id);
	ele.setAttribute("href", "image/"+imgFO[j].id+"."+imgFO[j].ext);
	 imgdf.appendChild(ele);
}

//ココまで繰り返す
var	parent =standardOPFxml.querySelector("manifest");
console.log(ele)
//var	reference = standardOPFxml.getElementById('cover');
//coverの書き換え properties="cover-image"
	reference.setAttribute("media-type", coverFO.type);
	reference.setAttribute("href", "image/"+"cover."+coverFO.ext);
	reference.setAttribute("properties", "cover-image");
//coverFO.file_id+"."+coverFO.ext
	parent.insertBefore(imgdf,reference.nextSibling);
//	parent.insertBefore(ele,reference.nextSibling);
	console.log(parent);

//manifest xhtml
//<item media-type="application/xhtml+xml" id="p-001" href="xhtml/p-001.xhtml" properties="svg" fallback="i-001"/>
var xhtdf = standardOPFxml.createDocumentFragment();
/*
var xele = standardOPFxml.createElement("item");
	xele.setAttribute("media-type", "application/xhtml+xml");
	xele.setAttribute("id", "p-002");
	xele.setAttribute("href", "xhtml/p-002.xhtml");
	xele.setAttribute("properties", "svg");
	xele.setAttribute("fallback", "i-002");
*/
//繰り返し用
for (j = 0; j < imgFO.length; j++){
imgFO[j].xhid="p-"+ ('0000' + (j+1) ).slice( -3 );
//var xele = standardOPFxml.createElement("item");
var	xreference = standardOPFxml.getElementById('p-cover');
var xele = xreference.cloneNode(true);
//コードを整形しようとしたが無理だった。
//var item='\n<item media-type="application/xhtml+xml" id="p-001" href="xhtml/p-001.xhtml" properties="svg" fallback="i-001"/>'
//var itemxml = (new DOMParser()).parseFromString(item, 'text/xml');
//var xele= standardOPFxml .importNode(itemxml.getElementById('p-001') , true);

	xele.setAttribute("media-type", "application/xhtml+xml");
	xele.setAttribute("id", imgFO[j].xhid);
	xele.setAttribute("href", "xhtml/"+imgFO[j].xhid+".xhtml");
	xele.setAttribute("properties", "svg");
	xele.setAttribute("fallback", imgFO[j].id);
	 xhtdf.appendChild(xele);
}
 //ココまで繰り返す
var	xparent =standardOPFxml.querySelector("manifest");
console.log(xele)
//var	xreference = standardOPFxml.getElementById('p-cover');
//	parent.appendChild(ele);
//	xparent.insertBefore(xele,xreference.nextSibling);
	xparent.insertBefore(xhtdf,xreference.nextSibling);
	console.log(xparent);

//spine
//<itemref linear="yes" idref="p-001" properties="page-spread-right"/>
var spinedf = standardOPFxml.createDocumentFragment();
for (j = 0; j < imgFO.length; j++){
var	sreference = standardOPFxml.querySelector("itemref[idref='p-cover']");
var spele = sreference.cloneNode(true);
//var spele = standardOPFxml.createElement("itemref");
	spele.setAttribute("linear", "yes");
	spele.setAttribute("idref", imgFO[j].xhid);
//右綴じの場合
if (document.getElementById("binding-ltr").checked){
	if(j% 2 == 0){spele.setAttribute("properties", "page-spread-left")};
	if(j% 2 == 1){spele.setAttribute("properties", "page-spread-right")};}

//左綴じの場合
else{
	if(j% 2 == 0){spele.setAttribute("properties", "page-spread-right")};
	if(j% 2 == 1){spele.setAttribute("properties", "page-spread-left")};}
	 spinedf.appendChild(spele);
}

var	sparent =standardOPFxml.querySelector("spine");
console.log(spele)
//var	sreference = standardOPFxml.querySelector("itemref[idref='p-cover']");
	sparent.insertBefore(spinedf,sreference.nextSibling);
	console.log(sparent);
	
//XMLシリアライズ
standardOPFS = (new XMLSerializer()).serializeToString(standardOPFxml);
console.log(standardOPFxml);
standardOPFS=vkbeautify.xml(standardOPFS);
//2重実行の防止
return standardOPFS;
}
function rewriteNAV(){
//ナビゲーションファイル
var navigationXml = (new DOMParser()).parseFromString(navigation, 'text/xml');
navigationXml.querySelector("title").textContent=$("#title").val();
navigationXml.querySelectorAll("li")[0].childNodes[0].textContent=$("#covertext").val();
/*単体のナビゲーション編集
navigationXml.querySelectorAll("li")[1].childNodes[0].textContent=$("#navtext1").val();
var select =document.getElementById("InputSelect2").selectedIndex
var pagenum = navigationXml.querySelectorAll("li")[1].childNodes[0]
pagenum.setAttribute("href", "xhtml/"+imgFO[select].xhid+".xhtml")
var	reference = navigationXml.querySelectorAll("li")[1];
var Nav = reference.cloneNode(true);
*/
var df = navigationXml.createDocumentFragment();
var menu=$("*[name=formNav]");
var navtext= document.getElementsByName("selectNav")
for (j = 0; j < menu.length; j++){ 
var	reference = navigationXml.querySelectorAll("li")[0];
var Nav = reference.cloneNode(true);
 var sele=navtext[j].selectedIndex;
	Nav.firstChild.setAttribute("href", "xhtml/"+ imgFO[sele].xhid +".xhtml");
	Nav.firstChild.text=$("*[name=editNav]")[j].value;
	 df.appendChild(Nav);
}
var	parent =navigationXml.querySelector("ol");
console.log(Nav)
	parent.insertBefore(df,reference.nextSibling);
	console.log(parent);

//XMLシリアライズ
navigationS = (new XMLSerializer()).serializeToString(navigationXml);
console.log(navigationXml);
navigationS =vkbeautify.xml(navigationS);
//2重実行の防止
return navigationS;
}
function rewriteNCX(){
//toc.ncx ncx:meta name="dtb:uid"
var ncxXml = (new DOMParser()).parseFromString(ncx, 'text/xml');
ncxXml.querySelector("meta[name='dtb:uid']").setAttribute("content", objV4.urn);
ncxXml.querySelector("docTitle").childNodes[1].textContent=$("#title").val();
ncxXml.querySelector("docAuthor").childNodes[1].textContent=$("#author1").val();
ncxXml.getElementById("p01").childNodes[1].childNodes[1].textContent=$("#covertext").val();
/*
ncxXml.getElementById("about").childNodes[1].childNodes[1].textContent=$("#navtext1").val();
var select =document.getElementById("InputSelect2").selectedIndex;
ncxXml.getElementById("about").childNodes[3].setAttribute("src", "xhtml/"+imgFO[select].xhid+".xhtml");
*/
//ncxXml.getElementById("about").getAttribute("playOrder")
//ncxXml.getElementById("about").getAttribute("id")
//ncxXml.getElementById("p01")

var df = ncxXml.createDocumentFragment();
var menu=$("*[name=formNav]");
var navtext= document.getElementsByName("selectNav")
for (j = 0; j < menu.length; j++){ 
var	reference = ncxXml.getElementById("p01");
var Nav = reference.cloneNode(true);
 var sele=navtext[j].selectedIndex;
 	Nav.setAttribute("playOrder",(j+2))
 	Nav.setAttribute("id","nav"+(j+1))
 	Nav.childNodes[1].childNodes[1].textContent=$("*[name=editNav]")[j].value;
	Nav.childNodes[3].setAttribute("src", "xhtml/"+ imgFO[sele].xhid +".xhtml");
	 df.appendChild(Nav);
}
var	parent =ncxXml.querySelector("navMap");
console.log(Nav)
	parent.insertBefore(df,reference.nextSibling);
	console.log(parent);

//navPointの取得
//ncxXml.querySelectorAll("navPoint")[1]
//
//XMLシリアライズ
ncxS = (new XMLSerializer()).serializeToString(ncxXml);
console.log(ncxXml);
ncxS=vkbeautify.xml(ncxS);
//2重実行の防止
return ncxS;
}
function rewrite(){
//表紙XHTML　coverxhtml
var coverxhtmlXml = (new DOMParser()).parseFromString(coverxhtml, 'text/xml');
coverxhtmlXml.querySelector('title').textContent=$("#title").val();
var viewport = coverxhtmlXml.querySelector("meta[content]");
var svg = coverxhtmlXml.querySelector("svg[viewBox]");
var imagesize = coverxhtmlXml.querySelector("image");
viewport.setAttribute("content", 'width='+$("#imgwidth").val() +' ,'+'height='+$("#imgheight").val());
svg.setAttribute("viewBox", '0 0 '+$("#imgwidth").val() +' '+$("#imgheight").val());
imagesize.setAttribute("width",$("#imgwidth").val());
imagesize.setAttribute("height",$("#imgheight").val());
//画像ファイル名の設定
imagesize.setAttributeNS("http://www.w3.org/1999/xlink","href","../image/cover."+coverFO.ext);

coverxhtml = (new XMLSerializer()).serializeToString(coverxhtmlXml);
//console.log(viewport.content);
//console.log(coverxhtmlXml);
//console.log(imagesize.getAttributeNS("http://www.w3.org/1999/xlink","href"));

//ページXHTML　pagexhtml
//pagexhtmlの初期設定
//マークダウンパーサーでHTMLに変換し、DOMパーサーでDOM。
//XMLとDOM結合させた。
splitmarkdown();
for (i = 0; i < markFO.length; i++){
var markdom= (new DOMParser()).parseFromString(marked(markFO[i]), 'text/html');
var markbody = markdom.querySelector("body");
var pagexhtmlXml = (new DOMParser()).parseFromString(pagexhtml, 'text/xml');
pagehtml = pagexhtmlXml.querySelector("html");
pagehtml.appendChild(markbody);
var pagebody = pagexhtmlXml.querySelector("body");
pagebody.setAttribute('class', 'bodymatter')
pagebody.setAttributeNS("http://www.idpf.org/2007/ops","epub:type","bodymatter");
pages[i] = vkbeautify.xml((new XMLSerializer()).serializeToString(pagexhtmlXml));
}
console.log(pages);

}

//zip圧縮
jQuery(function($) {
  if(!JSZip.support.blob) {
      $("#demo-not-supported").removeClass("hidden");
      $("#demo").hide();
      return;
  }
  $("#demo").click(function () {
standardOPFS=rewriteOPF();
navigationS = rewriteNAV();
ncxS=rewriteNCX();
rewrite();
var zip = new JSZip();
zip.file("mimetype", "application/epub+zip");
var meta = zip.folder("META-INF");
meta.file("container.xml", containerXML);
var item = zip.folder("OEBPS");
item.file("content.opf", standardOPFS);
item.file("nav.xhtml", navigationS);
item.file("toc.ncx", ncxS);
item.file("style.css",css_style);
item.file("template.css",css_templete);
item.file("cover.xhtml",coverxhtml);
//item.file("bodymatter_0_0.xhtml",pagexhtml);
//マークダウンをパースしてからhtmlファイルを書き込む。
for (j = 0; j < textFO.length; j++){
xhtml.file("bodymatter_0_"+j+".xhtml", pages[j]);
}
//表紙画像を書き込む
img.file("cover."+coverFO.ext, coverFO.data.split('base64,')[1], {base64: true});
//画像のファイル名とデータを取得して書き込む。
for (j = 0; j < imgFO.length; j++){
img.file("i-"+ ('0000' + (j+1) ).slice( -3 )+"."+imgFO[j].ext, imgFO[j].data.split('base64,')[1], {base64: true});
}
zip.generateAsync({type:"blob"})
.then(function(content) {
// see FileSaver.js
saveAs(content, $("#title").val()+".epub");
});
  });
});