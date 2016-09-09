
//Classie.js是一个功能强大并且非常轻量级的脚本，它可以让你添加、删除、切换以及检查DOM中的类变的非常容易。
// 很多JavaScript严重的核心是围绕着类的添加与删除，今天，CSS3 transitions, transforms, 以及animations开始流行，
// 很多非常酷的特效可以通过简单的添加一个类到一个元素上创立。比如通过触摸如何将图片过渡到视图区？仅仅是给图片添加几个transition属性，
// 关联触摸类拥有transform属性，通过JavaScript触摸事件添加给图片添加类，这样就完成了一个流畅的、漂亮的CSS3 transition.
//     强大的Classie.js
// 如果没有一个像jQuery这样的库的话那么想要添加、删除类将不是一件轻松的事，但是很多时候JS库对你的需求来说往往太过臃肿。
// 我在很多自己需要使用库的项目里，我发现仅仅是需要用到类的切换/检查的功能。进入 classie.js, 一个可强大的超级轻量级脚本,
// 它允许您很容易添加、删除、切换,和检查DOM中的类。 Classie.js 带给我们奇妙的和简单的实用性, 不会让我们的脚本变得臃肿。
// 毕竟它仅仅只有82行代码, 1.872 kb大小。下面是一个简单的classie.js实例 :
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */
// 在上面的例子中, el代表的是我们要查询的元素。我们检查是否它有一个类sweet。如果有, 则删除它。 如果没有, 就添加它。在一个臃肿的库的世界里这样的小脚本现在绝对正确的方式。
/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );
