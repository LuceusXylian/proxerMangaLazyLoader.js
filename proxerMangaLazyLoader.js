// ==UserScript==
// @name         proxerMangaLazyLoader.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lazy load manga images and reload them on user action
// @author       Xylian
// @match        https://proxer.net/read/*/*/*
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    if(typeof $ === "undefined") {
		console.error("proxerMangaLazyLoader.js: jQuery should be initialized, well bad");
    } else {
		// every img should have the src in data-src
		$("#reader img").each(function() {
			const obj = $(this);
			obj.attr("data-src", obj.attr("src") );
			obj.attr("src", "");
		});

		/*
		// prepare reload button
		var $reader = $("#reader");
		$reader.css("position", "relative");
		$reader.append('<div id="reader_reloader" style="display: none;">&#8635;</div>');
		var $reader_reloader = $("#reader_reloader");
		$reader_reloader.css("position", "absolute");
		$reader_reloader.css("z-index", "1");
		$reader_reloader.css("top", "0");
		$reader_reloader.css("left", "0");
		$reader_reloader.css("bottom", "0");
		$reader_reloader.css("right", "0");
		$reader_reloader.css("background", "rgba(0, 0, 0, 0.9)");
		$reader_reloader.css("font-family", "Lucida Sans Unicode");
		$reader_reloader.css("font-size", "60px");
		$reader_reloader.css("text-align", "center");
		$reader_reloader.css("padding-top", "40px");
		$reader_reloader.css("cursor", "pointer");
		*/


		// function for reloading all missing images
		var loadAllImages_isReady = true;
		function loadAllImages($images) {
			if(loadAllImages_isReady) {
				loadAllImages_isReady = false;

				var index = 0;
				$images.each(function() {
					var img = this;
					$(img).attr("src", "");

					var loadNextImage = function () {
						if(index < $images.length) {
							setTimeout(() => {
								var obj = $($images[index +1]);
								obj.attr("src", obj.attr("data-src") );
							}, 400);
						}
					}

					img.onload = function() {
						$(img).addClass("loaded");
						$(img).removeClass("error");
						loadNextImage();
					}

					img.onerror = function() {
						$(img).addClass("error");
						$(img).removeClass("loaded");
						loadNextImage();
						// $reader_reloader.show();
					}

					index++;
				});

                		if(index > 0) $(img).attr("src", $(img).attr("data-src") );

				loadAllImages_isReady = true;
			}
		}
	
    	}
	
	// start the lazy loader
	loadAllImages( $("#reader img:not(.loaded)") );
	/*
	$reader_reloader.on("click", function() {
		loadAllImages( $("#reader img.error") );
		$reader_reloader.hide();
	});
	*/
	
	
	// auto reload all error images
	setInterval(() => {
		loadAllImages( $("#reader img.error") );
	}, 2000);

	

})();
