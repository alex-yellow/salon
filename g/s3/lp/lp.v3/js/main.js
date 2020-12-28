'use strict'

;(function() {
	var $win = $(window),
		$doc = $(document),
		$html = $(document.documentElement),
		$body = $(document.body),
		iOs = /iPhone|iPad|iPod/i.test(navigator.userAgent),
		youtubeListPlayers = [];
		

	window.lp_template = {
		version: 'landing page v3',
		queue: {}
	};
	
	lp_template.checkAutoplayVideo = function($blocks) {
		$blocks.each(function() {
			var $this = $(this),
				playStatus = $this.data('playStatus'),
				inViewport = isElementInViewport(this),
				$video = $this.find('video'),
				$thisVideo = $video.length ? $video : $this.find('iframe');
	
			if (inViewport && playStatus !== 'play') {
				$this.trigger('autoplayVideo', ['play', $thisVideo[0].nodeName.toLowerCase()]);
				$this.data('playStatus', 'play');
			} else if (!inViewport && playStatus === 'play') {
				$this.trigger('autoplayVideo', ['pause', $thisVideo[0].nodeName.toLowerCase()]);
				$this.data('playStatus', 'pause');
			}
		})
	}
	
	/*
	
	window.initLPMaps = function(options) {
		
		options.center = options.center.split(',');
		
		$.each(options.data, function(key, item) {
			item.coords = item.coords.split(',');
		});

		if (options.type == 'google') {
				
			var map = new google.maps.Map(document.getElementById(options.id), {
				zoom: parseInt(options.zoom),
				scrollwheel: false,
				center: new google.maps.LatLng(options.center[0], options.center[1])
			});

			$.each(options.data, function(key, item) {
			
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(item.coords[0], item.coords[1]),
					map: map,
					title: item.name
				});

				var infowindow = new google.maps.InfoWindow({
					content: '<div class="baloon-content">' +
						'<h3 style="margin: 0; padding-bottom: 3px;">' + item.name + '</h3>' +
						item.desc +
						'</div>'
				});

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map, marker);
				});

			});

		} else {

			ymaps.ready(function() {
			
				setTimeout(function(){

					var map = new ymaps.Map(options.id, {
						center: options.center,
						zoom: options.zoom,
						behaviors: ['drag', 'rightMouseButtonMagnifier'],
					});
	
					map.controls.add(
						new ymaps.control.ZoomControl()
					);
	
					var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
						'<div class="baloon-content" style="padding: 0 10px;">' +
						'<h3 style="margin: 0;">$[properties.name]</h3>' +
						'<p>$[properties.desc]</p>' +
						'</div>'
					);
	
					var myCollection = new ymaps.GeoObjectCollection();
	
					$.each(options.data, function(key, item) {
						myCollection.add(new ymaps.Placemark(
							item.coords,
							item, {
								balloonContentLayout: MyBalloonContentLayoutClass
							}
						));
					});
	
					map.geoObjects.add(myCollection);
				});
			
			}, 500);

		}
	};
	
	window.onYouTubeIframeAPIReady = function() {
		var $block = $('.js-youtube-video');
		$block.each(function() {
			const player = new YT.Player(this.id, {
				videoId: this.dataset.videoId,
				playerVars: {
					autoplay: 1,
					mute: 1,
					controls: 0,
					fs: 0,
					rel: 0,
					loop: 1
				},
				events: {
					'onReady': onBgPlayerReady,
					'onStateChange': onBgPlayerStateChange
				}
			});
		});
	}*/
	
	lp_template.queue.scrollToAnchor = function($self) {
		
		if (s3LP.is_cms) return;
		
		$self.on('click', 'a', function(e){
			var $this = $(this),
				thisHref = $this.attr('href');
				
			if (thisHref.length < 2 || thisHref[0] != '#') return;
			
			var $thisBlock = $(thisHref);
			
			if (!$thisBlock.length) return;
			
			e.preventDefault();
			
			$('html, body').animate({
				scrollTop: $thisBlock.offset().top
			})
			$('html').css({
				overflow: 'visible'
			});
		});
	}
	
	lp_template.initMaps = function(options) {
		var map;
		
		if (options.type === "google") {
			map = new google.maps.Map(document.getElementById(options.id), {
				zoom: parseInt(options.zoom),
				scrollwheel: false,
				center: new google.maps.LatLng(options.center[0], options.center[1])
			});

			$.each(options.data, function(key, item) {
			
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(item.coords[0], item.coords[1]),
					map: map,
					title: item.name
				});

				var infowindow = new google.maps.InfoWindow({
					content: '<div class="baloon-content">' +
						'<h3 style="margin: 0; padding-bottom: 3px;">' + item.name + '</h3>' +
						item.desc +
						'</div>'
				});

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map, marker);
				});
				
				
			});
		
		} else {
			
			ymaps.ready(function() {
			
				map = new ymaps.Map(options.id, {
					center: options.center,
					zoom: options.zoom,
					behaviors: ['drag', 'rightMouseButtonMagnifier'],
				});

				map.controls.add(
					new ymaps.control.ZoomControl()
				);

				var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
					'<div class="baloon-content" style="padding: 0 10px;">' +
					'<h3 style="margin: 0;">$[properties.name]</h3>' +
					'<p>$[properties.desc]</p>' +
					'</div>'
				);

				var myCollection = new ymaps.GeoObjectCollection();

				$.each(options.data, function(key, item) {
					myCollection.add(new ymaps.Placemark(
						item.coords,
						item, {
							balloonContentLayout: MyBalloonContentLayoutClass
						}
					));
				});

				map.geoObjects.add(myCollection);
				
				$('#' + options.id).data('ymaps', map);
			});
		}
	}
	
	lp_template.queue.lpSimpleMap = function($self) {
		var $block = $self.find('.js-lp-simple-map');
		
		if ($block.length) {
			setTimeout(function(){
				$block.each(function(){
					var $this = $(this),
						thisParams = $this.data('init-params');
						
					thisParams = typeof thisParams === 'string' ? JSON.parse(thisParams) : thisParams;
						
					if (typeof thisParams.center === 'string') {
						thisParams.center = thisParams.center.split(',');
					}
					
					$.each(thisParams.data, function(key, item) {
						if (typeof item.coords === 'string') {
							item.coords = item.coords.split(',');
						}
					});
					
					lp_template.initMaps(thisParams);
				});
			}, 750);
		}
	}
	
	lp_template.queue.steps11 = function($self) {
		var $block = $self.hasClass('js-step-11') ? $self : $self.find('.js-step-11');
		if ($block.length) {
			try {
				let linePos = function(){
					let firstItemPos = $('.lp-steps-11-item__number').first().position().top,
						firstItemHeight = $('.lp-steps-11-item__number').first().outerHeight(),
						lastItemPos = $('.lp-steps-11-item__number').last().position().top;
	
					$('.lp-steps-11-items .line span').css('height', lastItemPos-firstItemPos-firstItemHeight);
					$('.lp-steps-11-items .line').css('top', firstItemPos+firstItemHeight);
				}
	
				linePos();
				$(window).resize(function(){
					var numbElemWidth = $block.find('.lp-steps-11-item__number').outerWidth() / 2;
					linePos();
					if (window.matchMedia('(max-width : 959px)').matches) {
				    	$block.find('.line').css('left', numbElemWidth);
				    }
				    else {
				    	$block.find('.line').css('left', '50%');
				    }
				});
	
			} catch(e) {
				console.log(e);
			}
		}
	}

	lp_template.queue.popupStepForm = function($self) {
		var $block = $self.find('.js-step-form-popup');
		
		if ($block.length) {
			$block.formsteps({
				mode: 'popup'
			});
		}
	};
	
	/*
	
	lp_template.queue.promoSlider = function($self) {
		var $block = $self.find('.js-promo2-slider');
		
		$block.each(function (index, slider) {
		    var $slider = $(slider);
		    var autoplay = $slider.data('autoplay') || false;
		    $slider.slick({
		      dots: true,
		      autoplay: !!autoplay,
		      autoplaySpeed: autoplay
		    });
		    $slider.on('beforeChange', function (event, slick) {
		      var $this = $(this);
		      var $cloned = $this.find('.slick-cloned');
		      $cloned.each(function (index, slide) {
		        styleSlide(slide);
		      });
		      slick.$slides.each(function (index, slide) {
		        styleSlide(slide);
		      });
		    });
		  });
		  
		function styleSlide(slide) {
		  var $slide = $(slide).find('.lp-promo2__slider-item');
		  var $img = $slide.find('img');
		
		  if ($img.height() < $slide.height()) {
		    $slide.css({
		      'display': 'flex',
		      'align-items': 'center'
		    });
		  }
		}
	};*/
	
	lp_template.queue.headerInPopup = function($self) {
	
		/* Old Version */
		if (s3LP.is_cms) return;
		
		var $block = $self.find('._js-in-promo');
		
		if ($block.length) {
			$block.each(function(){
				var $this = $(this),
					$thisParent = $this.next('._insert-header');
					
				if ($thisParent.length) {
					$this.insertBefore($thisParent.find('.js-promo-before'));
					$thisParent.addClass('_header_inserted');
				}
			});
		}
	};
	
	lp_template.queue.headerCommunity = function($self) {
		var $header = $self.find('.js-community');
		
		if (s3LP.is_cms) return;
		
		if ($header.length) {
			$header.each(function() {
				var $this = $(this),
					$thisNewParent = findPromoBlock($this);
					
				if ($thisNewParent) {
					$this.insertBefore($thisNewParent.find('.js-before-community'));
					$thisNewParent.addClass('_unified');
				}
			});
		}
		
		function findPromoBlock ($block) {
			if (!$block.length) return null;
			
			var $next = $block.next('.js-make-community');
			
			if ($next.length) return $next;
			
			if (!$next.length) {
				return findPromoBlock($block.next());
			}
		}
	};
	
	lp_template.queue.partnersSlider1 = function($self) {
		var $block = $self.find('.js-partners-1');

		if ($block.length) {

			$block.each(function() {
				var $slider = $(this),
					count = $slider.data('count'),
					autoplay = !!$slider.data('autoplay'),
					pause = $slider.data('pause'),
					speed = $slider.data('speed'),
					arrows = !!$slider.data('arrows'),
					infinite = !!$slider.data('infinite');
					
				$slider.owlCarousel({
					autoplay: autoplay,
					autoplayTimeout: pause,
					smartSpeed: speed,
					loop: infinite,
					dots: false,
					responsive: {
						0: {
							items: 1,
							margin: 0
						},
						600: {
							items: 3,
							margin: 24
						},
						960: {
							items: 3,
							margin: 48
						},
						1200: {
							items: count,
							margin: 24
						},
						1380: {
							items: count,
							margin: 36
						}
					}
				});
			});
		}		
	};

	lp_template.queue.contactsTab = function($self) {
		var $block = $self.find('.js-contacts-tab-1');
		var $allTabs = $self.find('.tab-item');
		var activeClass = 'active';
		
		$block.on('click', function(){
			
			var $thisParent = $(this).closest('.tab-item');
			
			if ($thisParent.hasClass(activeClass)) {
				$thisParent.removeClass(activeClass).find('.tab-item__text-part').slideUp();
			} else {
			
				$allTabs.removeClass(activeClass).find('.tab-item__text-part').slideUp();
				
				$thisParent.addClass(activeClass).find('.tab-item__text-part').slideDown();
			}
		});
		
		$($block[0]).trigger('click');
	}

	lp_template.queue.formInputs = function($self) {		
		
		$doc.on('click', '.js-select, .js-multi_select', function() {
			var $this = $(this),
				openedClass = '_opened',
				$thisParent = $this.closest('.lp-form-tpl__field-select, .lp-form-tpl__field-multi_select'),
				$thisList = $thisParent.find('.lp-form-tpl__field-select__list, .lp-form-tpl__field-multi_select__list');
				
			if ($thisParent.hasClass(openedClass)) {
				$thisParent.removeClass(openedClass);
				$thisList.slideUp();
			} else {
				$thisParent.addClass(openedClass);
				$thisList.slideDown();
			}
		});
		
		$doc.on('click', '.js-choose-select', function() {
			var $this = $(this),
				thisText = $this.text(),
				$thisParent = $this.closest('.lp-form-tpl__field-select'),
				checkedClass = '_checked';
				
			if (!$this.hasClass(checkedClass)) {
				$thisParent.find('.js-choose-select').removeClass(checkedClass);
				$this.addClass(checkedClass);
				$thisParent.find('.lp-form-tpl__field-select__input').text(thisText);
				$thisParent.parent().find('input').val(thisText);
			}
			
			$thisParent.find('.lp-form-tpl__field-select__list').slideUp();
			$thisParent.removeClass('_opened');
				
		});
		
		$doc.on('click', '.js-choose-milti_select', function() {
			var $this = $(this),
				$thisParent = $this.closest('.lp-form-tpl__field-multi_select'),
				checkedClass = '_checked';
				
			if (!$this.hasClass(checkedClass)) {
				$this.addClass(checkedClass);
			} else {
				$this.removeClass(checkedClass);
			}
			
			var choosenElements = $thisParent.find('.' + checkedClass),
				choosenElementsText = [];
				
			choosenElements.each(function() {
				choosenElementsText.push($(this).text());
			});
				
			$thisParent.find('.lp-form-tpl__field-multi_select__input--count').text(choosenElements.length);
			$thisParent.parent().find('input').val(choosenElementsText.join(', '));
		});
		
		
		
		$doc.on('click', function(e) {
			if ($(e.target).closest('.lp-form-tpl__field-select, .lp-form-tpl__field-multi_select').length) return;
			
			$doc.find('.lp-form-tpl__field-select, .lp-form-tpl__field-multi_select').removeClass('_opened');
			
			$doc.find('.lp-form-tpl__field-select__list, .lp-form-tpl__field-multi_select__list').slideUp();
		});
	}
	
	lp_template.queue.calendar = function($self) {
		$doc.on('click', '.js-form-calendar', function() {
			var $this = $(this),
				thisCalendarInited = $this.data('calendarInited');
				
			if (!thisCalendarInited) {
				var bb = $this.datepicker().data('datepicker');
				bb.show();
				thisCalendarInited = $this.data('calendarInited', true);
				
			}
		});
		
		$doc.on('click', '.js-form-calendar-interval', function() {
			var $this = $(this),
				thisCalendarInited = $this.data('calendarInited');
				
			if (!thisCalendarInited) {
				var bb = $this.datepicker({
					range: true,
					multipleDatesSeparator: " - "
				}).data('datepicker');
				bb.show();
				thisCalendarInited = $this.data('calendarInited', true);
			}
		});
	}
	
	lp_template.queue.lg = function($self) {
		var $block = $self.find('.js-lg-init');
		
		if ($block.length) {
			$block.lightGallery({
				selector: '.lg-item',
				share: false,
				hash: false,
				autoplayControls: false,
				actualSize: false,
				toogleThumb: false,
				getCaptionFromTitleOrAlt: false,
				download: false,
				thumbWidth: 64,
				thumbHeight: '64px',
				nextHtml: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.98528 4.32805C9.3758 3.93753 10.009 3.93753 10.3995 4.32805L17.0563 10.9849C17.4469 11.3754 17.4469 12.0086 17.0563 12.3991L10.3995 19.056C10.009 19.4465 9.3758 19.4465 8.98528 19.056C8.59475 18.6654 8.59475 18.0323 8.98528 17.6418L14.935 11.692L8.98528 5.74226C8.59475 5.35174 8.59475 4.71857 8.98528 4.32805Z" fill="white"/></svg>',
				prevHtml: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8492 5.03516L8.19239 11.692L14.8492 18.3489" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
			});
		}
	}
	
	lp_template.queue.qaToggle = function($self) {
		var $block = $self.hasClass('js-qa-toggle') ? $self : $self.find('.js-qa-toggle');
		
		if($block.length) {
			$block.each(function(){
				var $this = $(this);
				
				if($('.lp-qa-3-questions-col').length) {
					var elemLength = $('.lp-qa-3-questions-col:first-child').find('.lp-qa-3-questions__item');
					function getMaxOfArray(nums) {
					  return Math.max.apply(null, nums);
					}
					for (i = 0; i < elemLength.length; i++) {
						var i = i,
							numArr = [],
							$thisElem = $this.find('.lp-qa-3-questions__item:nth-child(' + (i + 1) + ') .lp-qa-3-questions__item-title');
							$($thisElem).each(function(){
								var height = $(this).outerHeight();
									numArr.push(height);
							});
						$thisElem.css('height', getMaxOfArray(numArr));
					}
				}
			
				if (s3LP.is_cms && !$('body').hasClass('preview_mode')) {
					setTimeout(function(){
						$this.find('._col:first-child ._item:first-child').addClass('isCMS').addClass('active');
					},500);
				}
		
				var $button = $this.find('.js-qa-show'),
					activeClass = 'active',
					$closeButton = $this.find('.js-qa-hide');
				
				$button.on('click', function(e) {
					e.preventDefault();
					var $parent = $(this).closest('._item');
					
					$parent.addClass(activeClass);
					$parent.find('._text').slideDown();
				});
				
				$closeButton.on('click', function(e) {
					e.preventDefault();
					var $parent = $(this).closest('._item');
					
					$parent.removeClass(activeClass);
					$parent.find('._text').slideUp();
				});
			});
			
		}
	}
	
	lp_template.queue.titleHeight = function($self) {
		var $block = $self.find('.js-title-height'),
			func = function() {
				$block.each(function(){
					var $this = $(this),
						$title = $this.find('._title'),
						minWidth = $this.data('min-width') || 960,
						minHeight = 0;
						
					$title.css({
						minHeight: 0
					});
					
					if ($(window).width() >= minWidth) {
						$title.each(function(){
							var thisHeight = $(this).height();
							
							if (minHeight < thisHeight) {
								minHeight = thisHeight;
							}
						});	
						
						$title.css({
							minHeight: minHeight
						});
					}
				});
			};
			
		$(window).on('resize', func);
		if (s3LP.is_cms) {
			setTimeout(function(){
				LpController.afterSave(function () {
				    func();
				});
			},1000);
		}
	}
	
	lp_template.queue.accordeon = function($self) {
		var $block = $self.find('.js-accordeon');
		
		$block.on('click', function() {
			var $thisParent = $(this).closest('._item'),
				$thisText = $thisParent.find('._text');
			
			if (!$thisText.is(':animated')) { 
				$thisParent.toggleClass('active');
				$thisText.slideToggle();
			}
		});
		
		if (s3LP.is_cms && !$('body').hasClass('preview_mode')) {
			$block.closest('[data-block-layout]').find('._item:first-child').addClass('isCMS').addClass('active');
		}
	}
	
	lp_template.queue.qa10Tabs = function($self) {
		var $block = $self.find('.js-10-qa');
		
		$win.on('resize', function(){
			
			$block.each(function(){
				var contentHeight = 0,
					$this = $(this);
				
				$this.find('.lp-qa-10-item__text').each(function(){
					if ($(this).height()>contentHeight){
						contentHeight = $(this).height()
					}
				});
				
				$this.find('.lp-qa-10-content').css('min-height', contentHeight);
			});
		});
		
		$block.on('click', '.lp-qa-10-item__title', function() {
			var $this = $(this),
				$parent = $this.closest('.js-10-qa'),
				$content = $this.parent().find('.lp-qa-10-item__text'),
				$allTitles = $parent.find('.lp-qa-10-item__title');
				
			if ($win.width() > 959) {
			
				var qaContent = $parent.find('.lp-qa-10-content');

				if ($this.hasClass('_active')) {
					qaContent.html('');				
					$this.removeClass('_active');
				} else {
					qaContent.html('');
					$allTitles.removeClass('_active');
					$this.addClass('_active');
					$content.clone(true).removeAttr('style').appendTo(qaContent);
				}
				
			
			} else {
				
				if ($this.hasClass('_active')) {
					$this.removeClass('_active');
					$content.slideUp();
				} else {
					$allTitles.removeClass('_active');
					$parent.find('.lp-qa-10-item__text').slideUp();

					$this.toggleClass('_active')
					$content.slideDown();
				}
			}
		});
		
		$block.each(function(){
			var $this = $(this);
			
			$this.append('<div class="lp-qa-10-content"></div>');
			
			$this.find('.lp-qa-10-item__title').eq(0).trigger('click');
		});
	}

	lp_template.queue.videoPlayButton = function($self) {
		var $allVideoParets = $self.find('.js-lp-play-video').closest('.lp-video-block-wrappper');

		$self.on('click', '.js-lp-play-video', function(e) {
			e.preventDefault();
			
			var $this = $(this);
			var thisVideo = $this.parent('.lp-video-block-wrappper').find('video')[0];
			
			$this.addClass('hide');
			thisVideo.play();
			thisVideo.setAttribute('controls', 1);
		});
		
		$allVideoParets.find('video').each(function(){
			this.addEventListener('pause', function(){
				this.removeAttribute('controls');
				$(this).parent('.lp-video-block-wrappper').find('.js-lp-play-video').removeClass('hide')
			});
		});
	}
	
	lp_template.queue.lpStepForm = function($self) {
	  var $block = $self.find('.js-lp-steps-form');
	
	  if ($block.length) {
	    $block.formsteps();
	  }
	}
	
	lp_template.queue.qaSlider1 = function($self) {
		var $block = $self.find('.js-qa-slider-1');

		if ($block.length) {
			$block.each(function(){
				var $this = $(this),
					autoplay = !!$this.data('autoplay'),
					count = $this.data('count') || 2,
					loop = !!$this.data('infinite'),
					nav = !!$this.data('arrows'),
					dots = !!$this.data('dots'),
					pause = $this.data('pause') || 5000,
					speed = $this.data('speed') || 250,
					$parent = $this.closest('[data-block-layout]'),
					$dots = $parent.find('.js-dot-item');

				$this.owlCarousel({
					autoplay : autoplay,
					loop : loop,
					nav : nav,
					dots : true,
					smartSpeed: speed,
					autoplayTimeout: pause,
					responsive:{
						0: {
							items : 1,
							margin : 0
						},
						960: {
							items: count,
							margin : count > 1 ? 48 : 0
						},
						1200: {
							items: count,
							margin : count > 1 ? 24 : 0
						},
						1380: {
							items: count,
							margin : count > 1 ? 32 : 0
						}
					},
					onInitialized: function() {
						$dots.eq(0).addClass('active')
					},
					onTranslated: function(e) {
						$dots.removeClass('active');
					}
				});

				$parent.on('click', '.js-next-slide', function(e) {
					e.preventDefault();
					$this.trigger('next.owl.carousel');
				});

				$parent.on('click', '.js-prev-slide', function(e) {
					e.preventDefault();
					$this.trigger('prev.owl.carousel');
				});

				$parent.on('click', '.js-dot-item', function(e) {
					e.preventDefault();
					$this.trigger('to.owl.carousel', [$(this).index()]);
				});

			});
		}
	}

	lp_template.queue.simpleSlider = function($self) {
		var $block = $self.find('.js-simple-slider');

		if ($block.length) {
			$block.each(function(){
				var $this = $(this),
					autoplay = !!$this.data('autoplay'),
					loop = !!$this.data('infinite'),
					autoWidth = !!$this.data('autowidth'),
					center = !!$this.data('center'),
					nav = !!$this.data('arrows'),
					dotsEach = !!$this.data('dots-each'),
					dots = 1,
					pause = $this.data('pause') || 5000,
					speed = $this.data('speed') || 250,
					fade = !!$this.data('fade'),
					parentSelector = $this.data('parent') ? $this.data('parent') : '[data-block-layout]',
					$parent = $this.closest(parentSelector),
					dataResponse = $this.data('response'),
					response = {},
					$dots = $parent.find('.lp-dots-wrapper');

				response.responsive = dataResponse || {};
				

				$this.owlCarousel($.extend({
					items : 1,
					autoplay : autoplay,
					loop : loop,
					autoWidth: autoWidth,
					center: center,
					nav : nav,
					dots : true,
					dotsEach: dotsEach,
					animateIn: fade ? 'fadeIn' : false,
					animateOut: fade ? 'fadeOut' : false,
					smartSpeed: speed,
					mouseDrag: s3LP.is_cms ? false : true, 
					autoplayTimeout: pause,
					onInitialized: function(e) {
						var $dotsCount = $parent.find('.owl-dot').length;
						
						if (!$dots.length || $dotsCount < 2) {
							$dots.html('');
							
							$parent.find('.js-next-slide, .js-prev-slide').addClass('_hide');
							return;
						};
						var $dotsHTML = '';
						
						for(var i = 0; i < $dotsCount; i++) {
							$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
						} 
						
						if (!$dots.hasClass('_unchanged')) {
						
							$dots.html($dotsHTML);
						
						}
						
						$dots.find('.lp-dots-item').eq(0).addClass('active');
						
					},
					
					onResized: function(e) {
						if (!$dots.length || e.page.count < 2) {
							$dots.html('');
							$parent.find('.js-next-slide, .js-prev-slide').addClass('_hide');
							$parent.find('.js-next-slide, .js-prev-slide').removeClass('_show');
							return;
						} else {
							$parent.find('.js-next-slide, .js-prev-slide').addClass('_show');
							$parent.find('.js-next-slide, .js-prev-slide').removeClass('_hide');
						}
						
						var $dotsHTML = '';
						for(var i = 0; i < e.page.count; i++) {
							$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
						}
						
						if (!$dots.hasClass('_unchanged')) {
							$dots.html($dotsHTML);
						}
						$dots.find('.lp-dots-item').removeClass('active');
						$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
					},
					onTranslate: function(e) {
						$dots.find('.lp-dots-item').removeClass('active');
						$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
					}
				}, response));

				$parent.on('click', '.js-next-slide', function(e) {
					e.preventDefault();
					$this.trigger('next.owl.carousel');
				});

				$parent.on('click', '.js-prev-slide', function(e) {
					e.preventDefault();
					$this.trigger('prev.owl.carousel');
				});

				$parent.on('click', '.js-dot-item', function(e) {
					e.preventDefault();
					$this.trigger('to.owl.carousel', [$(this).index()]);
				});
				
				if (s3LP.is_cms) {
					setTimeout(function(){
						LpController.afterSave(function () {
						    setTimeout(function(){
					    		$this.trigger('refresh.owl.carousel');
						    },500);
						});
			    		$this.trigger('refresh.owl.carousel');
					},3000);
				}
				
				$win.on('load', function(){
					setTimeout(function(){
			    		$this.trigger('refresh.owl.carousel');
				    },500);
				});

			});
		}
	}
	
	lp_template.queue.adv17HalfHeight = function($self) {	
		var $block = $self.find('.js-advantages-17');
	
		$block.each(function(){
			var $this = $(this);
	
	
			$(window).on('resize', function(){
				calcMargin($this);
			});		
		});
	
		function calcMargin(e) {
			var itemHalfHeight = e.parent().find('.lp-advantages-17__item').eq(0).outerHeight() / 2;
			
			e.css({
				paddingBottom: itemHalfHeight,
				marginBottom: -itemHalfHeight
			});		
		};
	}
	
	lp_template.queue.video13 = function($self) {	
		var $block = $self.find('.js-video-13');
	
		$block.each(function(){
			var $this = $(this);
	
	
			$(window).on('resize', function(){
				calcMargin($this);
			});		
		});
	
		function calcMargin(e) {
			var itemHeight = e.parent().find('.lp-video-13__item-video').eq(0).outerHeight();
			
			e.css({
				paddingBottom: itemHeight,
				marginBottom: -itemHeight
			});		
		};
	}
	
	lp_template.queue.header15Popup = function($self) {
		var $block = $self.find('.lp-header-15');
		$block.find('.js-burger').on('click', function(){
			$(this).closest('.lp-wrapp').find('.js-menu__wrap').fadeIn().addClass('opened');
			$('body').css('overflow', 'hidden');
		});
		$block.find('.js-close, .js-bg').on('click', function(){
			$(this).closest('.lp-wrapp').find('.js-menu__wrap').removeClass('opened').fadeOut();
			$('body').css('overflow','visible');
		});
		
		$block.find('.js-menu a').on('click', function(){
		    setTimeout(function(){
		    	$block.find('.js-menu__wrap').removeClass('opened').fadeOut();
				$('body').css('overflow','visible');
		    },300);
		});
		
		$(document).keyup(function(e) {
		     if (e.key === "Escape") { // escape key maps to keycode '27'
		        $block.find('.js-menu__wrap.opened').removeClass('opened').fadeOut();
				$('body').css('overflow','visible');
		    }
		});
	}
	
	lp_template.queue.lpTimer = function($self) {
		var $block = $self.find('.js-lp-timer'),
			htmlLang = document.documentElement.lang,
			timerDays, timerHours, timerMinutes, timerSeconds, formatOut;
		
		if (htmlLang == 'de' || htmlLang == 'en') {
			timerDays = 'days';
			timerHours = 'hours';
			timerMinutes = 'minutes';
			timerSeconds = 'seconds'
	    } else {
			timerDays = 'Дней';
			timerHours = 'Часов';
			timerMinutes = 'Минут';
			timerSeconds = 'Секунд'
	    }
	    
	    var formatOut = '<div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%d</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerDays + '</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%h</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerHours + '</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%m</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerMinutes + '</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%s</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerSeconds +'</div></div>';
	    var formatEnd = '<div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerDays + '</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerHours + '</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerMinutes + '</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-4" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' + timerSeconds +'</div></div>';
	    
	    
		
		if ($block.length) {
			$block.each(function(){
				var $this = $(this);
				
				$this.timer({
					format_in: "%d.%M.%y %h:%m:%s",
					language: htmlLang,
					update_time: s3LP.is_cms ? 100000 : 1000,
					format_out: formatOut,
					onEnd: function(){
						$this.html(formatEnd);
					}
				})
			});	
		}
	}
	
		lp_template.queue.menu11Popup = function($self) {
		var $block = $self.hasClass('lp-menu-11') ? $self : $self.find('.lp-menu-11');
		
		$($block).append('<div class="lp-menu-block-bg"></div>');
		
		if (!$block.length) return;
			
		$block.each(function(){
			var $this = $(this),
				contactsMobile = true,
				mobile = true;
			
			$(window).on('resize', function(){
				contactsMobile = contactsPend($this, contactsMobile);
				mobile = menuPend($this, mobile);
			});
		})
			
		function contactsPend($block, bool) {
		
			if (window.matchMedia('(max-width : 599px)').matches && !bool) {
				$block.find('.lp-menu-11__top').appendTo($block.find('.lp-menu-11__popup .lp-menu-11__menu_inner'));
				return true;
			}
			else if (window.matchMedia('(min-width : 600px)').matches && bool) {
				$block.find('.lp-menu-11__top').prependTo($block.find('.lp-menu-11-wrap_top .lp-wrapp'));
				return false;
			}
			
			return bool;
		}
		
		function menuPend($block, bool) {
			if (window.matchMedia('(max-width : 959px)').matches && !bool) {
				$block.find('.js-menu_appedable').prependTo($block.find('.lp-menu-11__popup'));
				$block.find('.lp-menu-11__burger').show().css('display', 'flex');
				return true;
			}
			else if (window.matchMedia('(min-width : 960px)').matches && bool) {
				$block.find('.lp-menu-11__logo').after($block.find('.js-menu_appedable'));
				return false;
			}
			
			return bool;
		}
		
		
	    var $popup = $block.find('.js-popup'),
    		popupHeight = $(window).height() - $block.height(),
    		menuHeight = $block.outerHeight(),
    		popupTop = menuHeight < 0 ? 0 : menuHeight,
    		popupTop = s3LP.is_cms ? popupTop + 72 : popupTop,
    		$bgTop = $block.height() + 50 < 0 ? 0 : $block.height() + 50,
    		$bgTop = s3LP.is_cms ? $bgTop + 72 : $bgTop;
    		
		$block.find('.lp-menu-block-bg').css({top: $bgTop});
		
    	$popup.css({top: popupTop});
    	
	
		$block.find('.js-burger').on('click', function(){
			if ($(this).hasClass('_in-side')) {
	    		$popup.animate({top: 0}, 200);
	    		$block.find('.lp-menu-block-bg').css('top', 0);
	    	}
			if (!$(this).hasClass('_in-side')) {
			    if (s3LP.is_cms) {
		    		$('html, body').animate({
					    scrollTop: $block.offset().top - 72
					}, 200);
		    	}
		    	else {
		    		$('html, body').animate({
					    scrollTop: $block.offset().top
					}, 200);
		    	}
			}
	    	
	    	$popup.css('overflow', 'auto');
	    	
	    	$block.find('.js-burger').toggleClass('opened');
	    	if ($(this).closest('.lp-menu-11').find('.js-popup').hasClass('opened')) {
	    		$(this).closest('.lp-menu-11').find('.js-popup').animate({height: "0%"}, 300,
	    			function() {
	    				$block.css('z-index', '');
	    			}
	    		).removeClass('opened');
	    		$block.find('.lp-menu-block-bg').fadeOut(300);
	    		
	    		$('html').css('overflow', '');
	    		if (s3LP.is_cms) {
	    			$('html').css('overflow', '');
	    		}
	    	}
	    	else {
	    		$(this).closest('.lp-menu-11').find('.js-popup').animate({height: popupHeight}, 800).addClass('opened');
	    		$block.find('.lp-menu-block-bg').fadeIn(800);
	    		$block.css('z-index', '30');
	    		$('html').css('overflow', 'hidden');
	    		if (s3LP.is_cms) {
	    			$('html').css('overflow', 'hidden');
	    		}
	    	}
	    	
	    });
	    
	    $(document).on('click', function(e) {
		    if(!$(e.target).closest('.lp-menu-11__popup, .lp-menu-11-button').not(this).length){
		    	$(this).find('.js-popup').animate({height: "0%"}, 300,
	    			function() {
	    				$block.css('z-index', '');
	    			}
	    		).removeClass('opened');
	    		$(this).find('.lp-menu-block-bg').fadeOut(300);
	    		$block.find('.js-burger').removeClass('opened');
	    		$('html').css('overflow', '');
	    		if (s3LP.is_cms) {
	    			$('html').css('overflow', '');
	    		}
		    }
		});
	    
	    $block.find('.lp-menu-11__menu__link').on('click', function(){
	    	$block.find('.js-burger').toggleClass('opened');
			$popup.animate({height: "0%"}, 100,
    			function() {
    				$block.css('z-index', '');
    			}
    		).removeClass('opened');
    		$block.find('.lp-menu-block-bg').fadeOut(800);
    		$('html').css('overflow', '');
	    });
		
		$(window).on('resize', function(){
			var $ulWidth = 0,
				$ulWrapWidth = $block.find('.lp-menu-11__bot').innerWidth() - ($block.find('.lp-menu-11__logo').width() + $block.find('.lp-menu-11__right').outerWidth(true));
			$('li.lp-menu-11__menu__list-item').each(function(){
				var $width = $(this).outerWidth(true);
				$ulWidth += $width;
			});
			if (window.matchMedia('(min-width : 961px)').matches && ($ulWidth > $ulWrapWidth)) {
				$block.find('.js-menu_appedable').prependTo('.lp-menu-11__popup');
				$block.find('.lp-menu-11__burger').show().css('display', 'flex');
			}
			else if (window.matchMedia('(min-width : 961px)').matches && ($ulWidth < $ulWrapWidth)) {
				$block.find('.lp-menu-11__logo').after($block.find('.js-menu_appedable'));
				$block.find('.lp-menu-11__burger').hide();
			}
			
			
			
			menuHeight = $block.outerHeight(),
    		popupTop = menuHeight < 0 ? 0 : menuHeight,
    		popupTop = s3LP.is_cms ? popupTop + 72 : popupTop,
    		$bgTop = $block.height() + 50 < 0 ? 0 : $block.height() + 50,
    		$bgTop = s3LP.is_cms ? $bgTop + 72 : $bgTop;
			
			$popup.animate({top: popupTop});
	        
	    	$block.find('.lp-menu-block-bg').css('top', $bgTop);
		});
	}
	
	lp_template.queue.lpReviews10Slider = function($self) {
		var $block = $self.hasClass('lp-reviews-10') ? $self : $self.find('.lp-reviews-10');
	    var $slider = $block.find('.js-review-10-slider');
	    if ($slider.length) {
	
	        $slider.each(function(){
				
	            var $this = $(this);
	            var $parent = $this.closest('[data-block-layout]');
	            var $arrows = $this.data('arrows');
	            var $dots = $this.data('dots');
	            var $autoplay = $this.data('autoplay');
	            var $infinite = $this.data('infinite');
	            var $autoplaySpeed = $this.data('autoplay-speed');
	            var $speed = $this.data('speed');
	            var $slide = $this.find('.lp-reviews-10-slider__slide');
	
	            // это нужно для того, чтобы последний слайд всегда состоял из 3 отзывов
	            $slider.on('init', function(slick, currentSlide){
	                var slides = currentSlide.$slides;
	                var lastChild = slides[slides.length - 1];//Последний слайд
	                var children = lastChild.children;
	                var emptyDivs = [];
	
	                if(slides.length > 1) {
	
	                    for(var i = 0; i < children.length; i++) {
	                        if(children[i].childNodes.length < 1) {
	                            emptyDivs.push(children[i]);
	                        }
	                    }
	
	                    for(var j = 0; j < emptyDivs.length; j++) {
	                        emptyDivs[j].appendChild($slide[j].cloneNode(true));
	                    }
	                }
	            });
	
	            $this.slick({
	                infinite: $infinite,
	                mobileFirst: true,
	                // fade:$fade,
	                dots:$dots,
	                autoplay: $autoplay,
					autoplaySpeed: $autoplaySpeed,
					speed: $speed,
	                dotsClass:'lp-reviews-10-slider__dots',
	                appendDots:$parent.find('.lp-reviews-10-slider__dots-block'),
	                arrows:false,
	                appendArrows:$parent.find('.lp-reviews-10-slider__arrows-block'),
	                prevArrow:'<a href="#" data-elem-type="card_container" data-lp-selector=".lp-reviews-10-slider__arrows" class="lp-button lp-button--type-1 lp-reviews-10-slider__arrows lp-reviews-10-slider__arrows--left _v2-icon"><div class="_slider-arrows" data-elem-type="card_container" data-lp-selector="._slider-arrows-inner"><div class="_slider-arrows-inner"></div><div class="_slider-arrows-inner"></div></div></a>',
	                nextArrow:'<a href="#" data-elem-type="card_container" data-lp-selector=".lp-reviews-10-slider__arrows" class="lp-button lp-button--type-1 lp-reviews-10-slider__arrows lp-reviews-10-slider__arrows--right _v2-icon"><div class="_slider-arrows reverse" data-elem-type="card_container" data-lp-selector="._slider-arrows-inner"><div class="_slider-arrows-inner"></div><div class="_slider-arrows-inner"></div></div></a>',
	                responsive: [
	                    {
	                        breakpoint: 599.9,
	                        settings: {
	                            arrows:$arrows
	                        }
	                    },
	                    {
	                        breakpoint: 959.9,
	                        settings: {
	                            arrows:$arrows,
	                            slidesPerRow:1,
	                            rows:3
	
	                        }
	                    }
	                ]
	            });
	        });
	        $(window).on('resize', function(){
	        	setTimeout(function(){
	        		var $dotItem = $block.find('.lp-reviews-10-slider__dots li button');
	        		if ($dotItem.hasClass('lp-reviews-10-slider__dot')) {
	        			
	        		}
	        		else {
				        $dotItem.attr('data-elem-type', 'card_container');
				        $dotItem.addClass('lp-reviews-10-slider__dot');
				        $dotItem.attr('data-lp-selector','.lp-reviews-10-slider__dot');
	        		}
	        	},100);
	        });
	    }
	}
	
	lp_template.queue.lpForm19CalcBottomMargin = function($self) {
		var $block = $self,
			margin = ($block.find('.lp-form-19__bottom').height()
								+ parseInt($(".lp-form-19__bottom").css("padding-top"))
				 				+ parseInt($(".lp-form-19__bottom").css("padding-bottom")))/2;
		$block.find('.lp-form-19__top-bg').css({
			"margin-bottom" : - margin						
		});
	};
	
	lp_template.queue.lpGallery1 = function($self) {
		var $block = $self.hasClass('lp-gallery-1') ? $self : $self.find('.lp-gallery-1'),
	    	$mainSlider = $block.find('.js-main-slick'),
	    	$thumbSlider = $block.find('.js-thumb-slick'),
	    	$prevBtn = $block.find('.js-slider-prev'),
	    	$nextBtn = $block.find('.js-slider-next'),
			$slidesToShowData = $block.data('count');
	
		if ($mainSlider.length) {
		    $mainSlider.slick({
		        slidesToShow: 1,
		        slidesToScroll: 1,
		        arrows: false,
		        fade: true,
		        asNavFor: $thumbSlider,
		        adaptiveHeight: false
		    })
		
		    $thumbSlider.slick({
		        slidesToShow: 3,
		        slidesToScroll: 1,
		        asNavFor: $mainSlider,
		        dots: false,
		        centerMode: true,
		        arrows: false,
		        touches: true,
		        prevArrow: $prevBtn,
		        nextArrow: $nextBtn,
		        focusOnSelect: true,
		        adaptiveHeight: false,
		        centerPadding: '6px',
		        mobileFirst: true,
		        swipeToSlide: false,
		        responsive: [
		            {
		                breakpoint: 600,
		                settings: {
		                    slidesToShow: $slidesToShowData,
		                    centerPadding: '20px'
		                }
		            },
		            {
		                breakpoint: 960,
		                settings: {
		                    slidesToShow: $slidesToShowData,
		                    arrows: true,
		                    centerPadding: '0px'
		                }
		            }
		        ]
		    });
	    }
	};
	
	lp_template.queue.lpGallery3 = function ($self) {

		var $block = $self,
			owl = $block.find('.js-photo-3-mask'),
			$nextSlide = $block.find('.js-next-slide'),
			$prevSlide = $block.find('.js-prev-slide'),
			$thumbItem = $block.find('.js-preview-item');
		
		if (owl.length) {
		
			owl.owlCarousel({
				items : 1,
				autoplay : false,
				loop : false,
				nav : false,
				dots : false,
				animateIn: 'fadeIn',
				animateOut: 'fadeOut',
				smartSpeed: 300,
				mouseDrag: false,
				touchDrag: false
			});
		
		
			$($nextSlide).click(function(e) {
				e.preventDefault();
			    owl.trigger('next.owl.carousel');
			});
			$($prevSlide).click(function(e) {
				e.preventDefault();
			    owl.trigger('prev.owl.carousel', [300]);
			});
		
			$($thumbItem).on('click', function () {
			    var click = $(this).index();
			    owl.trigger( 'to.owl.carousel', [click] );
			    $(this).addClass('_active').siblings().removeClass('_active');
			});
		}
	};
	
	lp_template.queue.products29 = function($self) {
	  $self.on('click', '.js-gallery29-item', function(){
	    var $this = $(this);
	
	    $this.addClass('_active').siblings().removeClass('_active');
	    $this.closest('[data-block-layout]').find('.lp-prods-29-background__item').removeClass('_active').eq($this.index()).addClass('_active');
	
	  });
	}
	
	lp_template.queue.lpGallery17 = function($self) {
		
		var $block = $self.hasClass('js-grid-gallery') ? $self : $self.find('.js-grid-gallery');
		
		$block.each(function(){
			if ($block.length) {
				var $this = $(this),
					$slider = $this.find('.js-gallery-items'),
					autoplay = !!$slider.data('autoplay'),
					infinite = !!$slider.data('infinite'),
					nav = !!$slider.data('arrows'),
					dotsEach = !!$slider.data('dots-each'),
					dots = true,
					pause = $slider.data('pause') || 5000,
					speed = $slider.data('speed') || 250,
					fade = !!$slider.data('fade'),
					$parent = $slider.closest('[data-block-layout]'),
					dataResponse = $slider.data('response'),
					response = {},
					$dots = $this.find('.lp-dots-wrapper');
			    try {
			        let owl = $this.find('.js-gallery-items.js-owl-carousel'),
			            windowWidth = $(window).width(),
			            gridFormer = function(){
			            let wrapper = '<div class="js-gallery-items-grid"></div>',
			                itemsCount = $slider.children('.js-gallery-item').length,
			                sliceFunc = function(itemsInGrid){
			                    for (var i = 0; i < itemsCount/itemsInGrid; i++) {
			                        $slider.children('.js-gallery-item').slice(0, itemsInGrid).wrapAll(wrapper);
			                    }
			                    $slider.find('.js-gallery-items-grid').each(function(){
			                        $(this).addClass('_'+$(this).children().length);
			                    });
			                };
		
			            if (windowWidth<600) {
			                sliceFunc(2);                   
			            } else if (windowWidth<1200) {
			                sliceFunc(4);
			            } else {
			                sliceFunc(5);
			            }
			        }
		
			        let initOwl = function(){
		
			            $slider.owlCarousel($.extend({
							items : 1,
							autoplay : autoplay,
							loop : infinite,
			                rewind: true,
							nav : nav,
							dots : dots,
							animateIn: fade ? 'fadeIn' : false,
							animateOut: fade ? 'fadeOut' : false,
							smartSpeed: speed,
							autoplayTimeout: pause,
			                margin: 16,
							onInitialized: function(e) {
								var $dotsCount = $this.find('.owl-dot').length;
								
								if (!$dots.length || $dotsCount < 2) {
									$dots.html('');
									return;
								};
								var $dotsHTML = '';
								
								for(var i = 0; i < $dotsCount; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								} 
								
								if (!$dots.hasClass('_unchanged')) {
								
									$dots.html($dotsHTML);
								
								}
								
								$dots.find('.lp-dots-item').eq(0).addClass('active');
								
							},
							
							onResized: function(e) {
								if (!$dots.length || e.page.count < 2) {
									$dots.html('');
									return;
								}
								
								var $dotsHTML = '';
								for(var i = 0; i < e.page.count; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								}
								
								if (!$dots.hasClass('_unchanged')) {
									$dots.html($dotsHTML);
								}
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							},
							onTranslated: function(e) {
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							}
						}, response));
						$this.find('.js-next-slide').off();
						$this.find('.js-next-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('next.owl.carousel');
						});
						$this.find('.js-prev-slide').off();
						$this.find('.js-prev-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('prev.owl.carousel');
						});
		
			        }
		
			        let reInitOwl = function(){
			            owl.trigger('destroy.owl.carousel');
			            $this.find('.js-gallery-item').unwrap();
			            gridFormer();
			            initOwl();
			        }
		
			        gridFormer();
			        
			        initOwl();
		
		
			        $(window).resize(function(){                
			            let newWindowWidth = $(window).width();
			            if (windowWidth < 1200 && windowWidth >= 600) {                 
			                if (newWindowWidth >= 1200 || newWindowWidth < 600) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            } else if (windowWidth>=1200){
			                if (newWindowWidth < 1200) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            } else if (windowWidth<600){
			                if (newWindowWidth>=600) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            }
			        });
		
			    } catch(exception) {
			        console.log(exception);
			    }
		    }
		});
	}
	
	lp_template.queue.lpGallery19 = function($self) {
		
		var $block = $self.hasClass('lp-gallery-19') ? $self : $self.find('.lp-gallery-19');
		
		$block.each(function(){
			if ($block.length) {
				var $this = $(this),
					$slider = $this.find('.js-gallery-items'),
					autoplay = !!$slider.data('autoplay'),
					infinite = !!$slider.data('infinite'),
					nav = !!$slider.data('arrows'),
					dotsEach = !!$slider.data('dots-each'),
					dots = true,
					pause = $slider.data('pause') || 5000,
					speed = $slider.data('speed') || 250,
					fade = !!$slider.data('fade'),
					$parent = $slider.closest('[data-block-layout]'),
					dataResponse = $slider.data('response'),
					response = {},
					$dots = $this.find('.lp-dots-wrapper');
			    try {
			        let owl = $this.find('.js-gallery-items.js-owl-carousel'),
			            windowWidth = $(window).width(),
			            gridFormer = function(){
			            let wrapper = '<div class="lp-gallery-19__slider-item"></div>',
			                itemsCount = $slider.children('.js-gallery-item').length,
			                sliceFunc = function(itemsInGrid){
			                    for (var i = 0; i < itemsCount/itemsInGrid; i++) {
			                        $slider.children('.js-gallery-item').slice(0, itemsInGrid).wrapAll(wrapper);
			                    }
			                    $slider.find('.lp-gallery-19__slider-item').each(function(){
			                        $(this).addClass('_'+$(this).children().length);
			                    });
			                };
		
			            if (windowWidth<600) {
			                sliceFunc(1);                   
			            } else if (windowWidth<1200) {
			                sliceFunc(4);
			            } else {
			                sliceFunc(4);
			            }
			        }
		
			        let initOwl = function(){
		
			            $slider.owlCarousel($.extend({
							items : 1,
							autoplay : autoplay,
							loop : infinite,
			                rewind: true,
							nav : nav,
							dots : dots,
							animateIn: fade ? 'fadeIn' : false,
							animateOut: fade ? 'fadeOut' : false,
							smartSpeed: speed,
							autoplayTimeout: pause,
			                margin: 16,
							onInitialized: function(e) {
								var $dotsCount = $this.find('.owl-dot').length;
								
								if (!$dots.length || $dotsCount < 2) {
									$dots.html('');
									return;
								};
								var $dotsHTML = '';
								
								for(var i = 0; i < $dotsCount; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								} 
								
								if (!$dots.hasClass('_unchanged')) {
								
									$dots.html($dotsHTML);
								
								}
								
								$dots.find('.lp-dots-item').eq(0).addClass('active');
								
							},
							
							onResized: function(e) {
								if (!$dots.length || e.page.count < 2) {
									$dots.html('');
									return;
								}
								
								var $dotsHTML = '';
								for(var i = 0; i < e.page.count; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								}
								
								if (!$dots.hasClass('_unchanged')) {
									$dots.html($dotsHTML);
								}
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							},
							onTranslated: function(e) {
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							}
						}, response));
						$this.find('.js-next-slide').off();
						$this.find('.js-next-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('next.owl.carousel');
						});
						$this.find('.js-prev-slide').off();
						$this.find('.js-prev-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('prev.owl.carousel');
						});
		
			        }
		
			        let reInitOwl = function(){
			            owl.trigger('destroy.owl.carousel');
			            $this.find('.js-gallery-item').unwrap();
			            gridFormer();
			            initOwl();
			        }
		
			        gridFormer();
			        
			        initOwl();
		
			        $(window).resize(function(){                
			            let newWindowWidth = $(window).width();
			            if (windowWidth < 1200 && windowWidth >= 600) {                 
			                if (newWindowWidth >= 1200 || newWindowWidth < 600) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            } else if (windowWidth>=1200){
			                if (newWindowWidth < 1200) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            } else if (windowWidth<600){
			                if (newWindowWidth>=600) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            }
			        });
		
			    } catch(exception) {
			        console.log(exception);
			    }
		    }
		});
	}
	
	lp_template.queue.lpGallery23 = function($self) {
		var $block = $('.lp-gallery-23');
		if ($block.length) {
			$block.each(function(){
				var $this = $(this),
					$thisCount = $this.hasClass('_3') ? 4 : 3,
					$button = $this.find('.lp-gallery-23__button'),
					openText = $this.find('.lp-gallery-23__button-in._open-text'),
					closeText = $this.find('.lp-gallery-23__button-in._close-text'),
					$hiddenElems;
				
				
				try {
			        let itemMargin = 0,
			        	itemHeight = 0,
			        	containerHeight = 0,
						checkHeight = function(){
					        itemMargin = parseInt($this.find('.lp-gallery-23-item').css('margin-bottom'), 10),
				        	itemHeight = $this.find('.lp-gallery-23-item').height() + itemMargin,   	
				        	containerHeight = $this.find('.lp-gallery-23-items-wrapper').height()
							$thisCount = $this.hasClass('_3') ? 4 : 3;
		
					        if ($(window).width()<600 && itemHeight < 590) {
					        	itemHeight *= 2;
					        }
					        
					        if  ($(window).width()<600) {
					        	$thisCount = 2;
					        }
					        else if ($(window).width()<960) {
					        	$thisCount = 3;
					        }
					        
					        $hiddenElems = $this.find('.lp-gallery-23-item:nth-child(n + ' + $thisCount + ')');
		
			        		$this.find('.lp-gallery-23-items').css('max-height', itemHeight);
							$this.find('.lp-gallery-23-item').show();
							$hiddenElems.hide();
				    	};
				    	
				    checkHeight();
		
			        $(window).resize(function(){
			        	$button.removeClass('_opened');
		        		closeText.hide();
		        		openText.show();
			        	checkHeight();
			        });
		
			        $button.on('click', function(e){
			        	if ($(this).hasClass('_opened')) {
			        		$this.find('.lp-gallery-23-items').animate({
			        			'max-height': itemHeight
			        		}, 1000	);
			        		closeText.hide();
			        		openText.show();
			        		$hiddenElems.fadeOut();
			        	} else {
			        		$this.find('.lp-gallery-23-items').animate({
			        			'max-height': 100000
			        		}, 1000);
			        		closeText.show();
			        		openText.hide();
			        		$hiddenElems.fadeIn();
			        	}
			        	$(this).toggleClass('_opened');
			        });
		
		
				} catch(exception) {
					console.log(exception);
				}
			
			});
		}
	}
	
	lp_template.queue.lpGallery25 = function($self) {
		var $block = $('.lp-gallery-25');
		if ($block.length) {
			try {
				let bgPos = function(){
					if ($(window).width()<960) {
						let headerHeight = $('.lp-gallery-25__title').outerHeight();
						$('.lp-gallery-25 .lp-half-bg').css({
								top: headerHeight,
								left: 0,
								right: 0
						});
					} else {
						let headerWidth = 0;
		
						$('.lp-gallery-25 .lp-half-bg').css('top', 0);
						if ($('.lp-gallery-25').hasClass('_reverse')) {
							headerWidth = $('.lp-gallery-25__title').outerWidth() + $('.lp-gallery-25-items').offset().left;
							$('.lp-gallery-25 .lp-half-bg').css({
									right: headerWidth,
									left: 0
							});
						} else {
							headerWidth = $('.lp-gallery-25__title').outerWidth() + $('.lp-gallery-25__title').offset().left;
							$('.lp-gallery-25 .lp-half-bg').css({
									right: 0,
									left: headerWidth
							});
						}
					}
				}
		
				if ($('div').is(".lp-gallery-25__title")) {
					if (s3LP.is_cms && !$('body').hasClass('preview_mode')) {
						setTimeout(function(){
							bgPos();
						},500);
					}
					
					$(window).resize(function(){
						bgPos();
					});
				}
		
			} catch(exception) {
				console.log(exception);
			}
		}
	}
	
	lp_template.queue.lpCertificate15 = function($self) {
		
		var $block = $self.hasClass('lp-certificate-15') ? $self : $self.find('.lp-certificate-15');
		
		$block.each(function(){
			if ($block.length) {
				var $this = $(this),
					$slider = $this.find('.js-gallery-items'),
					autoplay = !!$slider.data('autoplay'),
					infinite = !!$slider.data('infinite'),
					nav = !!$slider.data('arrows'),
					dotsEach = !!$slider.data('dots-each'),
					dots = true,
					pause = $slider.data('pause') || 5000,
					speed = $slider.data('speed') || 250,
					fade = !!$slider.data('fade'),
					$parent = $slider.closest('[data-block-layout]'),
					dataResponse = $slider.data('response'),
					response = {},
					$dots = $this.find('.lp-dots-wrapper');
			    try {
			        let owl = $this.find('.js-gallery-items'),
			            windowWidth = $(window).width(),
			            gridFormer = function(){
			            let wrapper = '<div class="lp-certificate-15__slider-item-wr"></div>',
			                itemsCount = $slider.children('.js-gallery-item').length,
			                sliceFunc = function(itemsInGrid){
			                    for (var i = 0; i < itemsCount/itemsInGrid; i++) {
			                        $slider.children('.js-gallery-item').slice(0, itemsInGrid).wrapAll(wrapper);
			                    }
			                    $slider.find('.lp-certificate-15-slider-item').each(function(){
			                        $(this).addClass('_'+$(this).children().length);
			                    });
			                };
		
			            if (windowWidth<600) {
			                sliceFunc(1);                   
			            } else if (windowWidth<1200) {
			                sliceFunc(2);
			            } else {
			                sliceFunc(2);
			            }
			        }
		
			        let initOwl = function(){
		
			            $slider.owlCarousel($.extend({
							items : 1,
							autoplay : autoplay,
							loop : infinite,
			                rewind: true,
							nav : nav,
							dots : dots,
							animateIn: fade ? 'fadeIn' : false,
							animateOut: fade ? 'fadeOut' : false,
							smartSpeed: speed,
							autoplayTimeout: pause,
			                margin: 0,
							onInitialized: function(e) {
								var $dotsCount = $this.find('.owl-dot').length;
								
								if (!$dots.length || $dotsCount < 2) {
									$dots.html('');
									return;
								};
								var $dotsHTML = '';
								
								for(var i = 0; i < $dotsCount; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								} 
								
								if (!$dots.hasClass('_unchanged')) {
								
									$dots.html($dotsHTML);
								
								}
								
								$dots.find('.lp-dots-item').eq(0).addClass('active');
								
							},
							
							onResized: function(e) {
								if (!$dots.length || e.page.count < 2) {
									$dots.html('');
									return;
								}
								
								var $dotsHTML = '';
								for(var i = 0; i < e.page.count; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								}
								
								if (!$dots.hasClass('_unchanged')) {
									$dots.html($dotsHTML);
								}
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							},
							onTranslated: function(e) {
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							}
						}, response));
						$this.find('.js-next-slide').off();
						$this.find('.js-next-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('next.owl.carousel');
						});
						$this.find('.js-prev-slide').off();
						$this.find('.js-prev-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('prev.owl.carousel');
						});
		
			        }
		
			        let reInitOwl = function(){
			            owl.trigger('destroy.owl.carousel');
			            $this.find('.js-gallery-item').unwrap();
			            gridFormer();
			            initOwl();
			        }
		
			        gridFormer();
			        
			        initOwl();
		
			        $(window).resize(function(){                
			            let newWindowWidth = $(window).width();
			            if (windowWidth < 1200 && windowWidth >= 600) {                 
			                if (newWindowWidth >= 1200 || newWindowWidth < 600) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            } else if (windowWidth>=1200){
			                if (newWindowWidth < 1200) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            } else if (windowWidth<600){
			                if (newWindowWidth>=600) {
			                    windowWidth = newWindowWidth;
			                    reInitOwl();
			                }
			            }
			        });
		
			    } catch(exception) {
			        console.log(exception);
			    }
		    }
		});
	}
	
	lp_template.queue.lpPromo10 = function($self) {
		var $block = $self,
			$block_slider = $block.find('.js-promo10-slider');
		
		if ($block_slider.length) {
			$block_slider.each(function(){
				
				var $this = $(this),
					$parent = $this.closest('[data-block-layout]'),
					$dots = $this.data('dots'),
					$autoplay = $this.data('autoplay'),
					$infinite = $this.data('infinite'),
					$autoplaySpeed = $this.data('autoplay-speed'),
					$speed = $this.data('speed');
				
				$block.find('.js-promo10-slider').slick({
				    arrows: false,
				    dots: $dots,
				    infinite: $infinite,
				    fade: true,
				    speed: $speed,
				    slidesToShow: 1,
				    autoplay: $autoplay,
				    autoplaySpeed: $autoplaySpeed,
				    dotsClass:'lp-promo10__slider-dots',
				    appendDots:$('.js-promo10-slider')
			
				});
			
			});
			
			$(window).on('resize', function(){
	        	setTimeout(function(){
	        		var $dotItem = $block.find('.lp-promo10__slider-dots li button');
	        		if ($dotItem.hasClass('lp-promo10__slider-dot')) {
	        			
	        		}
	        		else {
				        $dotItem.attr('data-elem-type', 'card_container');
				        $dotItem.addClass('lp-promo10__slider-dot');
				        $dotItem.attr('data-lp-selector','.lp-promo10__slider-dot');
				        $dotItem.attr('data-has-event','1');
	        		}
	        	},500);
	        });
		}
	}
	
	lp_template.queue.lpPromo12 = function ($self) {

	    var $block = $self,
	    	$slider = $self.find('.js-promo12-slider');
	
	    if ($slider.length) {
	        $slider.each(function(){
	
	            let $this = $(this);
	            let $parent = $this.closest('[data-block-layout]');
	            
	            var $dots = $this.data('dots'),
					$autoplay = $this.data('autoplay'),
					$infinite = $this.data('infinite'),
					$autoplaySpeed = $this.data('autoplay-speed'),
					$speed = $this.data('speed');
	
	            $this.slick({
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                fade: true,
	                infinite: $infinite,
	                dots: $dots,
	                autoplay: $autoplay,
				    autoplaySpeed: $autoplaySpeed,
				    speed: $speed,
	                dotsClass: 'lp-promo-12-slider__dots',
	                appendDots: $parent.find('.lp-promo-12-slider'),
	                prevArrow: $parent.find('.lp-promo-12-slider__arrow--left'),
	                nextArrow: $parent.find('.lp-promo-12-slider__arrow--right')
	            });
	            
	            $(window).on('resize', function(){
		        	setTimeout(function(){
		        		var $dotItem = $block.find('.lp-promo-12-slider__dots li button');
		        		if ($dotItem.hasClass('lp-promo-12-slider__dot')) {
		        			
		        		}
		        		else {
					        $dotItem.attr('data-elem-type', 'card_container');
					        $dotItem.addClass('lp-promo-12-slider__dot');
					        $dotItem.attr('data-lp-selector','.lp-promo-12-slider__dot');
					        $dotItem.attr('data-has-event','1');
		        		}
		        	},100);
		        });
	        });
	    }
	}
	
	lp_template.queue.lpPromo17 = function ($self) {

	    var $slider = $self.find('.js-promo-17-slider');
	
	    if ($slider.length) {
	        $slider.each(function(){
	
	            var $this = $(this);
	            var $parent = $this.closest('[data-block-layout]');
	
	            $this.slick({
	                infinite: true,
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                fade: true,
	                dots:true,
	                dotsClass: 'lp-promo-17__dots',
	                appendDots: $parent.find('.lp-promo-17'),
	                prevArrow: $parent.find('.lp-promo-17__slider-arrow--left'),
	                nextArrow: $parent.find('.lp-promo-17__slider-arrow--right')
	            });
	        });
	    }
	}
	
	lp_template.queue.check_age = function($self) {
		$self.on('click', '.js-close-popup.lp-popup-block-3__button', function(e){
			e.preventDefault();
			var $parent = $(this).closest('[data-block-id]');
			createCookie('block_' + $parent.data('block-id'), 1, 30);
		});

		$self.on('click', '.js-little-age', function(e) {
			e.preventDefault();
			var $parent = $(this).closest('[data-block-id]');

			$parent.find('.lp-popup-block-3__confirm').hide();
			$parent.find('.lp-popup-block-3__alert').show();			

			createCookie('little_age', 1, 30);
		});

		function createCookie(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+encodeURIComponent(value)+expires+"; path=/";
		}
	}
	
	lp_template.queue.certificates8 = function($self) {

	    var $block = $self.hasClass('lp-certificate-8') ? $self : $self.find('.lp-certificate-8');
	    
	    $block.each(function(){
		    var $this = $(this),
		    	$imageSlider = $this.find('.js-image-slider'),
		        $textSlider = $this.find('.js-text-slider'),
		        $sliderArrows = $this.find('.js-slider-arrows'),
		        $autoplay = $imageSlider.data('autoplay'),
				$pause = $imageSlider.data('pause'),
				$speed = $imageSlider.data('speed'),
				$dots = $imageSlider.data('dots'),
				$infinite = !!$imageSlider.data('infinite');
		
		    if ($('.lp-certificate-8__content').length) {
		        if ($imageSlider.find('.js-image-slider-item').length > 3) {
		            $imageSlider.slick({
		                asNavFor: $textSlider,
		                prevArrow: $this.find('.js-prev-slide'),
		                nextArrow: $this.find('.js-next-slide'),
		                mobileFirst: true,
		                slidesToScroll: 1,
		                slidesToShow: 1,
		                centerMode: true,
		                centerPadding: '0',
		                focusOnSelect: false,
		                autoplay: $autoplay,
		                autoplaySpeed: $pause,
		                speed: $speed,
		                infinite: $infinite,
		                dots: $dots,
		                dotsClass:'lp-certificate-8-slider__dots',
		                appendDots:$('.lp-certificate-8__dots-block'),
		                responsive: [{
		                    breakpoint: 960,
		                    settings: {
		                        centerMode: true,
		                        slidesToShow: 3
		                    }
		                }]
		            });
		        } else {
		            $sliderArrows.hide();
		            $imageSlider.css('display', 'flex');
		        }
		        
		        
		        $(window).on('resize', function(){
		        	setTimeout(function(){
		        		var $dotItem = $this.find('.lp-certificate-8-slider__dots li button');
		        		if ($dotItem.hasClass('lp-certificate-8-slider__dot')) {
		        			
		        		}
		        		else {
					        $dotItem.attr('data-elem-type', 'card_container');
					        $dotItem.addClass('lp-certificate-8-slider__dot');
					        $dotItem.attr('data-lp-selector','.lp-certificate-8-slider__dot');
		        		}
		        	},100);
		        });
		
		        $textSlider.slick({
		            slidesToShow: 1,
		            slidesToScroll: 1,
		            fade: true,
		            autoplay: $autoplay,
	                autoplaySpeed: $pause,
	                speed: $speed,
	                infinite: $infinite,
		            arrows: false,
		            selector: '.js-text-slider-item',
		            mobileFirst: true,
		            asNavFor: $imageSlider,
		            accessibility: false
		        });
		        
		        $this.find('.js-lg-init').lightGallery({
					selector: '.lg-item',
					toogleThumb: false,
					getCaptionFromTitleOrAlt: false,
					download: false,
					thumbWidth: 64,
					thumbHeight: '64px',
					nextHtml: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.98528 4.32805C9.3758 3.93753 10.009 3.93753 10.3995 4.32805L17.0563 10.9849C17.4469 11.3754 17.4469 12.0086 17.0563 12.3991L10.3995 19.056C10.009 19.4465 9.3758 19.4465 8.98528 19.056C8.59475 18.6654 8.59475 18.0323 8.98528 17.6418L14.935 11.692L8.98528 5.74226C8.59475 5.35174 8.59475 4.71857 8.98528 4.32805Z" fill="white"/></svg>',
					prevHtml: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8492 5.03516L8.19239 11.692L14.8492 18.3489" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
				});
		    }
	    });
	}
	
	lp_template.queue.menuSimplePopup = function($self) {
		
		var $block = $self.hasClass('js-menu-wrap') ? $self : $self.find('.js-menu-wrap');
		
		$block.each(function(){
			var $this = $(this),
				$topMenuWrap = $this.find('.js-menu__wrap'),
				$menu = $this.find('.js-menu_appedable'),
				$burger = $this.find('.js-burger'),
				$popup = $this.find('.js-popup'),
	    		popupHeight = $(window).height() - $this.height(),
	    		menuHeight = $this.outerHeight(),
	    		popupTop = menuHeight < 0 ? 0 : menuHeight,
	    		popupTop = s3LP.is_cms ? popupTop + 72 : popupTop,
	    		$bgTop = $this.height() + 50 < 0 ? 0 : $this.height() + 50,
	    		$bgTop = s3LP.is_cms ? $bgTop + 72 : $bgTop,
	    		$liHaschild = $this.find('.haschild');
    		
    		$this.find('.lp-menu-block-bg').animate({top: $bgTop}, 400);
	    	
	    	$popup.css('top', popupTop);
	    		
			$menu.clone().prependTo($topMenuWrap);
			
			$(this).append('<div class="lp-menu-block-bg"></div>');
			
			function menuShow() {
		        var $ulWidth = 0,
		            $ulWrapWidth = $this.find('.js-menu__wrap').width();
		
		        $($menu).children('li').each(function(){
		            var $width = $(this).children('a').outerWidth(true);
		            $ulWidth += $width;
		        });
		        if (window.matchMedia('(min-width : 960px)').matches) {
		        	if ($ulWidth < $ulWrapWidth) {
		        		$this.find('.js-menu__wrap').addClass('show');
		        		$this.find('.js-burger').hide();
		        	}
		        	else {
		        		$this.find('.js-menu__wrap').removeClass('show');
		        		$this.find('.js-burger').show();
		        	}
		        }
		        else if (window.matchMedia('(max-width : 959px)').matches) {
		    		$this.find('.js-menu__wrap').removeClass('show');
		    		$this.find('.js-burger').show();
		        }
		        
		        var $bgTop = $this.offset().top + $this.height();
		        
		        menuHeight = $this.outerHeight(),
	    		popupTop = menuHeight < 0 ? 0 : menuHeight,
	    		popupTop = s3LP.is_cms ? popupTop + 72 : popupTop,
	    		$bgTop = $this.height() < 0 ? 0 : $this.height(),
	    		$bgTop = s3LP.is_cms ? $bgTop + 72 : $bgTop;
	    		
	    		$this.find('.lp-menu-block-bg').animate({top: $bgTop}, 400);
	    		
    			$popup.css('top', popupTop);
	    		
	    		$this.find('.lp-menu-block-bg').css('top', $bgTop);
			}
			
		    $(window).on('resize', function(){
		    	
	    		setTimeout(function(){
					menuShow();
	    		},500);
	    		
		    }).trigger('resize');
		
		    $burger.on('click', function(){
		    	if ($(this).hasClass('_in-side')) {
		    		$popup.animate({top: 0}, 400);
		    		$this.find('.lp-menu-block-bg').css('top', 0);
		    	}
		    	if (!$(this).hasClass('_in-side')) {
			    	if (s3LP.is_cms) {
			    		$('html, body').animate({
						    scrollTop: $this.offset().top - 72
						}, 100);
			    	}
			    	else {
			    		$('html, body').animate({
						    scrollTop: $this.offset().top
						}, 100);
			    	}
		    	}
		    	
		    	$popup.find('.js-popup__inner').css({
		    		'overflow' : 'auto',
		    		'max-height' : '100%'
		    	});
		    	
		    	$burger.toggleClass('opened');
		    	
		    	if ($popup.hasClass('opened')) {
		    		$popup.animate({height: "0%"}, {duration: 800, complete: function() {$this.css('z-index', '')}}).removeClass('opened');
		    		$this.find('.lp-menu-block-bg').fadeOut(600);
		    		
		    		$('html').css('overflow', '');
		    	}
		    	else {
		    		$popup.animate({height: popupHeight}, {duration: 800}).addClass('opened');
		    		$this.find('.lp-menu-block-bg').fadeIn(600);
		    		$this.css('z-index', '999')
		    		$('html').css('overflow', 'hidden');
		    	}
		    });
	    	
		    $this.find('.haschild').on('click', function(e){
		    	e.stopPropagation();
		    	$(this).toggleClass('_open').children('ul').slideToggle();
		    });
		    
		    $popup.find('.js-menu_appedable').on('click', 'a', function(){
		    	$burger.toggleClass('opened');
		    	$popup.animate({height: "0%"}, 800).removeClass('opened');
	    		$this.find('.lp-menu-block-bg').fadeOut(600);
	    		$this.css('z-index', '');
	    		$('html').css('overflow', '');
		    });	
		    
		    if (s3LP.is_cms) {
				setTimeout(function(){
					LpController.afterSave(function () {
						menuShow();
						setTimeout(function(){
					    	$(window).trigger('resize');
						},500);
					});
				},2000);
			}
		});
	}
	
	lp_template.queue.productsTabs10 = function($self) {
	    let $tabsBlock = $self.find('.js-prods10');
	
	    if ($tabsBlock.length) {
	        $tabsBlock.each(function(){
	
	            let $this = $(this),
	                $tabItem = $this.find('.js-tab-item'),
	                $tabContent = $this.find('.js-content'),
	                $firstTabItem = $tabItem.first(),
	                $firstTabContent = $tabContent.first(),
	
	            activeFirstTab = function(){
	                $firstTabItem.addClass('_active');
	                $firstTabContent.addClass('_active');
	            }
	
	            activeFirstTab();
	
	
	            $tabItem.on('click', function() {
	                $(this).addClass('_active').siblings().removeClass('_active');
	                $tabContent.removeClass('_active').eq($(this).index()).addClass('_active');
	            });
	        })
	    }
	}
	
	lp_template.queue.setPropsForCircled = function($self) {
		var $block = $self.find('.circled_container');
		
		var resizedFunction = function() {
			$block.each(function(){
				var $this = $(this);
	            
				$this.css({
					'width' : '',
					'height' : ''
				});
				
				var $thisHeight = $this.height(),
		            $thisWidth = $this.width(),
		            maxValue = $thisHeight > $thisWidth ? $thisHeight : $thisWidth;
				
				setTimeout(function(){
					$this.css({
						'width' : maxValue,
						'height' : maxValue
					});
				},1000);
		    });
		}
		
		$(window).on('resize', resizedFunction);
		if (s3LP.is_cms) {
			setTimeout(function(){
				LpController.afterSave(function () {
				    resizedFunction();
				});
			},1000);
		}
	}
	
	lp_template.queue.equalHeight = function($self) {
		var $block = $self.find('.equal-height');
		
		var resizedFunction = function() {
			$block.each(function(){
				var $this = $(this);
	            
				$this.css({
					'height' : ''
				});
				
				var $thisWidth = $this.width(),
		            maxValue = $thisWidth;
				
				setTimeout(function(){
					$this.css({
						'height' : maxValue
					});
				},1000);
		    });
		}
		
		$(window).on('resize', resizedFunction);
		if (s3LP.is_cms) {
			setTimeout(function(){
				LpController.afterSave(function () {
				    resizedFunction();
				});
			},1000);
		}
	}
	
	lp_template.queue.steps17 = function($self) {
		var $block = $self.hasClass('lp-steps-17') ? $self : $self.find('.lp-steps-17');
		if ($block.length) {
			$block.find('.js-counter-btn').on('click', function(){
			    var $this = $(this),
			        $thisIndex = $this.index(),
			        $item = $block.find('.js-slider-item').eq($thisIndex);
			    if (!$this.hasClass('_active')) $this.addClass('_active').siblings().removeClass('_active');
			    if (!$item.hasClass('_active')) $($item).fadeIn().addClass('_active').css('display', 'flex').siblings().hide().removeClass('_active');
			});
		}
	}
	
	lp_template.queue.qa13 = function($self) {
	 	var $block = $self.hasClass('lp-qa-13') ? $self : $self.find('.lp-qa-13');
		if ($block.length)	{
			$block.each(function(){
				var $this = $(this);
				try {
					let colWrapper = '<div class="lp-qa-13-items-col"></div>',
						windowWidth = $(window).width(),
						evenElems = $this.find('.lp-qa-13-item:nth-child(even)');
			
					
					$this.find('.lp-qa-13-item').each(function(index, element){
						$(this).css('order', index+1);
						evenElems.addClass('_even');
					});
					
					let splitInCols = function() {
						if (windowWidth >= 960) {
						/*	$this.find('.lp-qa-13-items > .lp-qa-13-item:odd').wrapAll(colWrapper);
							$this.find('.lp-qa-13-items > .lp-qa-13-item').wrapAll(colWrapper);*/
							
							$this.find('.lp-qa-13-item._even').prependTo($this.find('.lp-qa-13-items-col').last());
						}
					}
			
					let setItemHeight = function(windowWidth) {
						if (windowWidth >= 960) {
							$this.find('.lp-qa-13-items-col').first().children('.lp-qa-13-item').each(function(index, element){
									
								let firstColItem = $(this).children('.lp-qa-13-item-title-wrapper'),
									secColItem = $this.find('.lp-qa-13-items-col').last().children('.lp-qa-13-item').eq(index).children('.lp-qa-13-item-title-wrapper');
								if (firstColItem.height()<secColItem.height()) {
									firstColItem.css('min-height', secColItem.height());	
								} else {
									secColItem.css('min-height', firstColItem.height());
								}	
							});
						} else {
							$this.find('.lp-qa-13-item-title-wrapper').css('min-height', '');
						}
					}
					splitInCols();
					setItemHeight(windowWidth);
					$(window).resize(function(){
						let newWindowWidth = $(window).width();
						if (windowWidth>=960){
							if (newWindowWidth < 960) {
								windowWidth = newWindowWidth;
								//$this.find('.lp-qa-13-item').unwrap();
								$this.find('.lp-qa-13-items-col').last().find('.lp-qa-13-item._even').appendTo($this.find('.lp-qa-13-items-col').first());
							}
						} else if (windowWidth<960){
							if (newWindowWidth>=960) {
								windowWidth = newWindowWidth;
								splitInCols();
							}
						}
						setItemHeight(newWindowWidth);
					});
			
				} catch(e) {
					console.log(e);
				}
			});
		}
	}
	
	lp_template.queue.header11 = function($self) {
		var $block = $self.hasClass('has-one-line-menu') ? $self : $self.find('.has-one-line-menu');
		if ($block.length) {
			$block.each(function(){
				var $this = $(this),
					$menu = $this.find('.js-nav-menu'),
					$menuControls = !!$this.data('menu-controls') ? $this.data('menu-controls') : 'border, indents, shadow, background',
					$dots = $this.find('.js-nav-menu-dots'),
					$navMenu = $this.find('.js-menu-wrap .js-nav-menu'),
					$lastLi = $this.find('.js-hidden-nav-menu'),
					$burger = $this.find('.js-side-menu-open-btn'),
					$sideMenu = $this.find('.js-side-menu');
					
				function oneLineMenu() {
					$navMenu.oneLineMenu({
					    minWidth  : 599,
					    lastClass : 'lp-header-hidden-nav js-hidden-nav-menu',
					    left: -25,
					    kebabHtml: '<div class="lp-header-dots js-nav-menu-dots" data-has-event="1" data-elem-type="container" data-lp-selector=".lp-header-dots"><div class="lp-header-dots-in" data-lp-selector=".circle" data-elem-type="container"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div></div>'
					});
					
					$(window).on('resize', function(){
						$dots = $this.find('.js-nav-menu-dots'),
						$lastLi = $this.find('.js-hidden-nav-menu');
						$dots.on('click', function(){
						    $this.find('.js-hidden-nav-menu > ul').toggleClass('_open');
						});	
						
						$lastLi.find('a').on('click', function(){
						    $this.find('.js-hidden-nav-menu > ul').toggleClass('_open');
						});	
						
						$this.find('.js-hidden-nav-menu > ul').attr('data-elem-type', 'generate').attr('data-lp-controls-list', $menuControls).addClass('lp-menu-19-inner').attr('data-lp-selector', '.lp-menu-19-inner');
						$this.find('.lp-block-bg .lp-block-overlay').clone().prependTo($this.find('.js-hidden-nav-menu > ul'));
					}).trigger('resize');
					
					$burger.on('click', function(){
						$sideMenu.toggleClass('_open');
						$this.find('._overlay').toggleClass('_open');
						$this.toggleClass('_opened');
						$burger.toggleClass('is-active');
						$('body').toggleClass('overflow');
					});
					
					$sideMenu.on('click', 'a', function(){
				    	$sideMenu.toggleClass('_open');
						$this.find('._overlay').toggleClass('_open');
						$this.toggleClass('_opened');
						$burger.toggleClass('is-active');
						$('body').toggleClass('overflow');
				    });	
				}
				
				oneLineMenu();
				
				if (s3LP.is_cms) {
					setTimeout(function(){
						LpController.afterSave(function () {
							$navMenu.destroy();
						    oneLineMenu();
						});
					},1000);
				}
			});
		}
	}
	
	lp_template.queue.steps14 = function($self) {
		
		var $block = $self.hasClass('lp-steps-14') ? $self : $self.find('.lp-steps-14');
		
		if ($block.length) {
			$block.each(function(){
				var $this = $(this);
				try {
		            var wrapRows = function wrapRows() {
		                var itemsCount = $this.find('.lp-steps-14-content>.lp-steps-14-item').length
		                  , sliceFunc = function sliceFunc(itemsInRow) {
		                    for (var i = 0; i < itemsCount / itemsInRow; i++) {
		                        $this.find('.lp-steps-14-content>.lp-steps-14-item').slice(0, itemsInRow).wrapAll(wrapper);
		                    }
		                };
		
		                if (windowWidth < 600) {} else if (windowWidth < 960) {
		                    sliceFunc(2);
		                } else if (windowWidth < 1200) {
		                    sliceFunc(3);
		                } else {
		                    sliceFunc(itemsInRow);
		                }
		            };
		
		            var windowWidth = $(window).width()
		              , wrapper = '<div class="lp-steps-14-row"></div>'
		              , itemsInRow = $this.find('.lp-steps-14-content').attr('data-count');
		            wrapRows();
		            $(window).resize(function() {
		                var newWindowWidth = $(window).width();
		
		                if (windowWidth < 960 && windowWidth >= 600) {
		                    if (newWindowWidth >= 960 || newWindowWidth < 600) {
		                        windowWidth = newWindowWidth;
		                        $this.find('.lp-steps-14-row>.lp-steps-14-item').unwrap();
		                        wrapRows();
		                    }
		                } else if (windowWidth < 1200 && windowWidth >= 960) {
		                    if (newWindowWidth >= 1200 || newWindowWidth < 960) {
		                        windowWidth = newWindowWidth;
		                        $this.find('.lp-steps-14-row>.lp-steps-14-item').unwrap();
		                        wrapRows();
		                    }
		                } else if (windowWidth >= 1200) {
		                    if (newWindowWidth < 1200) {
		                        windowWidth = newWindowWidth;
		                        $this.find('.lp-steps-14-row>.lp-steps-14-item').unwrap();
		                        wrapRows();
		                    }
		                } else if (windowWidth < 600) {
		                    if (newWindowWidth >= 600) {
		                        windowWidth = newWindowWidth;
		                        $this.find('.lp-steps-14-row>.lp-steps-14-item').unwrap();
		                        wrapRows();
		                    }
		                }
		                
		                
			                if (window.matchMedia('(min-width : 600px)').matches) {
				                var $circle = $this.find('.lp-steps-14-item__counter'),
				                	$circleHeight = $circle.outerHeight() / 2,
				                	$lastItem = $this.find('.lp-steps-14-item:not(:last-child)'),
				        			$arrow = $lastItem.find('.lp-steps-14-item__arrow');
				        			
				        		$('.lp-steps-14-item__arrow').css('top', '');
		        				$arrow.css('top', $circleHeight);
			                }
			                
			                else {
			                	$('.lp-steps-14-item__arrow').css('top', '');
			                }
		                
		                
		                
		            });
		        } catch (e) {
		            console.log(e);
		        }
			});
		}
	}
	
	lp_template.queue.features28 = function($self) {
		var $block = $self.hasClass('lp-features-28') ? $self : $self.find('.lp-features-28');

		if ($block.length) {

			$block.each(function() {
				var $this = $(this),
					pie28 = '';
				
				function donutInit() {
					console.log(listData);
					var listData = new Array(),
						listColor = new Array(),
						$pie = '.lp-features-28-pie';
						
					$this.find('.lp-features-28-item').each(function(index, element){
						let itemValue = parseInt($(this).find('.lp-features-28-item__text').text()),
							itemText = $(this).find('.lp-features-28-item__text').text();
							
						listColor.push($(this).find('.lp-features-28-item__color').css('background-color')),
						listData.push([itemText, itemValue]);
					});
			
					pie28 = $.jqplot($pie, [listData], {
						seriesDefaults: {
							renderer:$.jqplot.DonutRenderer,
							rendererOptions:{
								padding: 0,
								shadowOffset: 0,
								sliceMargin: 0,
								startAngle: 180,
								showDataLabels: true,
								dataLabels: 'label',
								totalLabel: false,
								seriesColors: listColor,
								borderWidth: 0.0
							}
						},
						grid: {
							borderWidth: 0.0,
							shadow: false,
							background: '#ffffff',
							backgroundColor: 'rgba(255, 255, 255, 0)'
							
						}
					});
		
					$this.find('.lp-features-28-pie .jqplot-data-label').addClass('lp-header-title-6 lp-features-28-item__text').attr('data-elem-type', 'text');
					$this.find('.lp-features-28-pie .jqplot-data-label').attr('data-lp-selecttor', '.lp-features-28-item__text');
				}
				
				donutInit();
				
				if (s3LP.is_cms) {
					setTimeout(function(){
						LpController.afterSave(function () {
						    
							pie28.destroy();
							setTimeout(function(){
								donutInit();
							},1000);
							
						});
					},1000);
				}
				
				$(window).resize(function(){
					if (window.matchMedia('(max-width : 600px)').matches) {
				    	pie28.destroy();
						donutInit();
				    }
				    else {
				    	pie28.destroy();
						donutInit();
				    }
				});
				
			});
		}		
	};
	
	lp_template.queue.features31 = function($self) {
		var $block = $self.hasClass('lp-features-31') ? $self : $self.find('.lp-features-31');

		if ($block.length) {

			$block.each(function() {
				var $this = $(this);
					
				$this.find('.lp-features-31-item').each(function(index, element){
					var listData = new Array(),
						listColor = new Array(),
						$pie = '#' + $this.find('.lp-features-31-pie').eq(index).attr('id'),
						$innerDiameter = 250;
					
					let itemValue = parseInt($(this).find('.lp-features-31-item__title').attr('data-value')),
						itemValueHidden = parseInt($(this).find('.lp-features-31-item__title._hidden').attr('data-value')),
						itemText = $(this).find('.lp-features-31-item__text').text(),
						itemTextHidden = $(this).find('.lp-features-31-item__title._hidden + .lp-features-31-item__text').text();
						listColor.push($(this).find('.lp-features-31-item__color._active-color').css('background-color'));
						listColor.push($(this).find('.lp-features-31-item__color._disabled-color').css('background-color'));
						listData.push([itemTextHidden, itemValueHidden]);
						listData.push([itemText, itemValue]);
					
					$(window).on('resize', function(){
						
						if (window.matchMedia('(min-width : 1380px)').matches) {
							$innerDiameter = 222;
						} else if (window.matchMedia('(min-width : 1200px)').matches) {
							$innerDiameter = 224;
						} else if (window.matchMedia('(min-width : 960px)').matches) {
							$innerDiameter = 228;
						} else if (window.matchMedia('(min-width : 600px)').matches) {
							$innerDiameter = 241;
						}
						
						if(!$('.lp-features-31-pie').eq(index).is(':empty')) {
							$('.lp-features-31-pie').html('');
						}
						
						var pie31 = $.jqplot($pie, [listData], {
							seriesDefaults: {
								renderer:$.jqplot.DonutRenderer,
								rendererOptions:{
									padding: 0,
									shadowOffset: 0,
									innerDiameter: $innerDiameter,
									sliceMargin: 0,
									startAngle: -90,
									showDataLabels: true,
									dataLabels: 'label',
									totalLabel: false,
									seriesColors: listColor,
									borderWidth: 0.0
								}
							},
							grid: {
								borderWidth: 0.0,
								shadow: false,
								background: 'rgba(255, 255, 255, 0)'
							}
						});
						
						$this.find('.lp-features-31-pie .jqplot-data-label').addClass('lp-header-title-1 lp-features-31-item__text').attr('data-elem-type','text').attr('data-lp-selector','.lp-features-31-item__text');
					}).trigger('resize');
					
				});
		
			});
		}		
	};
	
	lp_template.queue.sertificate5 = function($self) {
		var $block = $self.hasClass('lp-certificate-5') ? $self : $self.find('.lp-certificate-5');

		if ($block.length) {

			$block.each(function() {
				var $this = $(this);
			    	
			    function isotopeinit () {	
				    var	$mansoryItem = $this.find('.js-main-item'),
				    	$isotope = $this.find('.js-isotope');
					
					setTimeout(function(){
					    $isotope.isotope({
					        itemSelector: '.js-isotope-item',
					        originLeft: true
					    });
					}, 0.100);
			    }
			    isotopeinit();
			
				if (s3LP.is_cms) {
					setTimeout(function(){
						LpController.afterSave(function () {
						    isotopeinit();
						});
					},1000);
				}
			});
		}		
	};
	
	lp_template.queue.Init221303 = function ($self) {
					
	    var $gallery = $self.find('.lp-gallery-2');
	
	    if ($gallery.length) {
	        $gallery.each(function(){
	            var $thisBlock = $(this);
	            var $window = $(window);
	            var $maskPhoto = $(this).find('.js-photo-mask');
	            var $mainPhoto = $(this).find('.js-main-item');
	            var $previewPhoto = $(this).find('.js-preview-item');
	            var $touchStartX = 0;
	            var $touchEndX = 0;
	            var $nextPhotoBtn = $(this).find('.js-next-item');
	            var $prevPhotoBtn = $(this).find('.js-prev-item');
	            var $showMoreBtn = $(this).find('.js-show-more');
	            var $lightGallery = $(this).find('.js-light-gallery');
	
	
	            $mainPhoto.on('touchstart', function() {
	                // event.preventDefault();
	                // event.stopPropagation();
	                $touchStartX = event.targetTouches[0].screenX;
	            });
	
	            $mainPhoto.on('touchend', function() {
	                // event.preventDefault();
	                // event.stopPropagation();
	                $touchEndX = event.changedTouches[0].screenX;
	                handleGesture();
	            });
	
	            function showNextPhoto() {
	                if ($mainPhoto.length <= 7) {
	                    if ( !$mainPhoto.last().hasClass('_active')) {
	                        $mainPhoto.siblings('._active').next().addClass('_active');
	                        $previewPhoto.siblings('._active').next().addClass('_active');
	                        $mainPhoto.siblings('._active').first().removeClass('_active');
	                        $previewPhoto.siblings('._active').first().removeClass('_active');
	                    } else {
	                        $mainPhoto.siblings().removeClass('_active');
	                        $previewPhoto.siblings().removeClass('_active');
	                        $mainPhoto.first().addClass('_active');
	                        $previewPhoto.first().addClass('_active');
	                    }
	                } else {
	                    if ( !$mainPhoto.eq(5).hasClass('_active')) {
	                        $mainPhoto.siblings('._active').next().addClass('_active');
	                        $previewPhoto.siblings('._active').next().addClass('_active');
	                        $mainPhoto.siblings('._active').first().removeClass('_active');
	                        $previewPhoto.siblings('._active').first().removeClass('_active');
	                    } else {
	                        $mainPhoto.siblings().removeClass('_active');
	                        $previewPhoto.siblings().removeClass('_active');
	                        $mainPhoto.first().addClass('_active');
	                        $previewPhoto.first().addClass('_active');
	                    }
	                }
	                
	                $thisBlock.find('.lp-gallery-2-photo__preview-item-mask._active').removeClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask');
	                $thisBlock.find('.lp-gallery-2-photo__preview-item._active .lp-gallery-2-photo__preview-item-mask').addClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask._active');
	            }
	
	            function showPrevPhoto() {
	
	                if ($mainPhoto.length <= 7) {
	                    if ( !$mainPhoto.first().hasClass('_active')) {
	                        $mainPhoto.siblings('._active').prev().addClass('_active');
	                        $previewPhoto.siblings('._active').prev().addClass('_active');
	                        $mainPhoto.siblings('._active').last().removeClass('_active');
	                        $previewPhoto.siblings('._active').last().removeClass('_active');
	                    } else {
	                        $mainPhoto.siblings().removeClass('_active');
	                        $previewPhoto.siblings().removeClass('_active');
	                        $mainPhoto.last().addClass('_active');
	                        $previewPhoto.last().addClass('_active');
	                    }
	                } else {
	                    if ( !$mainPhoto.first().hasClass('_active')) {
	                        $mainPhoto.siblings('._active').prev().addClass('_active');
	                        $previewPhoto.siblings('._active').prev().addClass('_active');
	                        $mainPhoto.siblings('._active').last().removeClass('_active');
	                        $previewPhoto.siblings('._active').last().removeClass('_active');
	                    } else {
	                        $mainPhoto.siblings().removeClass('_active');
	                        $previewPhoto.siblings().removeClass('_active');
	                        $mainPhoto.eq(5).addClass('_active');
	                        $previewPhoto.eq(5).addClass('_active');
	                    }
	                }
	
					$thisBlock.find('.lp-gallery-2-photo__preview-item-mask._active').removeClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask');
	                $thisBlock.find('.lp-gallery-2-photo__preview-item._active .lp-gallery-2-photo__preview-item-mask').addClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask._active');
	            }
	
	
	
	            function handleGesture() {
	                var $touchPath = $touchStartX - $touchEndX;
	                if (Math.abs($touchPath) > 50) {
	                    if ($touchPath > 0) {
	                        //Next
	                        showNextPhoto();
	                    } else {
	                        //Prev
	                        showPrevPhoto();
	                    }
	                }
	            }
	
	            var setPhotoMaskSize = function() {
	                $maskPhoto.height($maskPhoto.width());
	            }
	
	
	            var showFirstPhoto = function() {
	                $mainPhoto.first().addClass('_active');
	                $previewPhoto.first().addClass('_active');
	                $previewPhoto.first().find('.lp-gallery-2-photo__preview-item-mask').addClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask._active');
	            }
	
	            showFirstPhoto();
	
	            if ($(window).width() < 600) {
	                setPhotoMaskSize();
	            }
	
	            $window.resize(function() {
	                if ($(window).width() < 600) {
	                    setPhotoMaskSize();
	                }
	            })
	
	            $nextPhotoBtn.on ('click', function (e) {
	            	e.preventDefault();
	                showNextPhoto();
	            })
	
	            $prevPhotoBtn.on('click', function (e) {
	            	e.preventDefault();
	                showPrevPhoto();
	            })
	
	            $previewPhoto.on('click', function() {
	                var $this = $(this);
	                if (!$this.hasClass('_active')) {
	                    $this.addClass('_active');
	                    $this.find('.lp-gallery-2-photo__preview-item-mask').addClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask._active');
	                    $this.siblings().removeClass('_active');
	                    $this.siblings().find('.lp-gallery-2-photo__preview-item-mask').removeClass('_active').attr('data-lp-selector', '.lp-gallery-2-photo__preview-item-mask');
	                }
	                $mainPhoto.eq($this.index()).addClass('_active').siblings().removeClass('_active');
	            })
	
	            $lightGallery.lightGallery({
	                thumbnail: true,
	                hideControlOnEnd: true,
	                slideEndAnimatoin: false,
	                loop: true,
	                download: false,
	                thumbWidth: 64,
	                thumbContHeight: 96,
	                toogleThumb: false,
	                thumbMargin: 8,
	                selector: '.js-main-item'
	            })
	
	            $showMoreBtn.on('click', function() {
	                $mainPhoto.eq(6).trigger('click')
	            })
	        })
	    }
	}
	
	lp_template.queue.lpGallery20 = function ($self) {
					
	    var $block = $self.hasClass('lp-gallery-20') ? $self : $self.find('.lp-gallery-20');
	
	    if ($block.length) {
	        $block.each(function(){
			    var $this = $(this),
			    	$photos = $this.find('.js-photos');
			    	
			    function placePhotoToMosaic() {
			        $photos.find('.js-photo').each(function(index) {
			            if ($(window).outerWidth(true) < 960) {
			                if (index % 3 == 0) { // wrap by 2 items
			                
			                    $(this).add($(this).next('.js-photo')).add(
			                        $(this).next().next('.js-photo')
			                    ).wrapAll('<div class="lp-gallery-20-photo__item-wrap" />');
			                }
			            } else {
			                if (index % 5 == 0) { // wrap by 2 items
			                    $(this).add(
			                        $(this).next('.js-photo')).add(
			                            $(this).next().next('.js-photo').add(
			                                $(this).next().next().next('.js-photo').add(
			                                    $(this).next().next().next().next('.js-photo')
			                                )
			                            )
			                        ).wrapAll('<div class="lp-gallery-20-photo__item-wrap" />');
			                }
			            }
			        });
			
			        $photos.find('.lp-gallery-20-photo__item-wrap').each(function(el) {
			            $(this).addClass('_' + $(this).children().length + '-item')
			        });
			    }
			
				$(window).on('resize', function(){
					if ($photos.find('.js-photo').parent().hasClass('lp-gallery-20-photo__item-wrap')) {
		        		$photos.find('.js-photo').unwrap();
		        		console.log('awdawda');
		        	}
		        	
	        		setTimeout(function(){
		    			placePhotoToMosaic();
	        		},0);
				});
	        })
	    }
	}
	
	lp_template.queue.lpGallery22 = function($self) {
		var $block = $self.hasClass('lp-gallery-22') ? $self : $self.find('.lp-gallery-22');

		if ($block.length) {
			$block.each(function(){
				var $this = $(this),
					$slider = $this.find('.js-owl-carousel'),
					autoplay = !!$slider.data('autoplay'),
					loop = !!$slider.data('infinite'),
					nav = !!$slider.data('arrows'),
					dotsEach = !!$slider.data('dots-each'),
					dots = 1,
					pause = $slider.data('pause') || 5000,
					speed = $slider.data('speed') || 250,
					fade = !!$slider.data('fade'),
					$parent = $slider.closest('[data-block-layout]'),
					dataResponse = $slider.data('response'),
					response = {},
					$dots = $parent.find('.lp-dots-wrapper'),
					$window = $(window),
			        $itemsInRow;
			
			
			    $slider.find('.js-photo-item').each(function(index) {
			        if (index % 2 == 0) { // wrap by 2 items
			            $(this).add($(this).next('.js-photo-item')).wrapAll('<div class="lp-gallery-22-gallery-item-wrap js-owl-carousel-item" />');
			        }
			    });
			
			    var $sliderItem = $this.find('.js-owl-carousel-item');
			
			    if ($this.hasClass('_6')) {
			        $itemsInRow = 6;
			    } else if ($this.hasClass('_8')) {
			        $itemsInRow = 8;
			    } else if ($this.hasClass('_12')) {
			
			        if ($window.width() < 960) {
			          $itemsInRow = 8
			        } else {
			            $itemsInRow = 12;
			        }
			    } else {
			        $itemsInRow = 4;
			    }
			
			    console.log($sliderItem.length);
			    console.log($itemsInRow);
			
			    if ($sliderItem.length > $itemsInRow) {
			        $slider.owlCarousel({
						autoplay : autoplay,
						loop : loop,
						nav : nav,
						dots : true,
						dotsEach: dotsEach,
						animateIn: fade ? 'fadeIn' : false,
						animateOut: fade ? 'fadeOut' : false,
						smartSpeed: speed,
						mouseDrag: s3LP.is_cms ? false : true, 
						autoplayTimeout: pause,
			            responsive: {
			                0: {
			                    items: 2,
			                    slideBy: 2
			                },
			                600: {
			                    items: $itemsInRow,
			                    slideBy: 1
			                }
			            },
						onInitialized: function(e) {
							var $dotsCount = $parent.find('.owl-dot').length;
							
							if (!$dots.length || $dotsCount < 2) {
								$dots.html('');
								
								$parent.find('.js-next-slide, .js-prev-slide').addClass('_hide');
								return;
							};
							var $dotsHTML = '';
							
							for(var i = 0; i < $dotsCount; i++) {
								$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
							} 
							
							if (!$dots.hasClass('_unchanged')) {
							
								$dots.html($dotsHTML);
							
							}
							
							$dots.find('.lp-dots-item').eq(0).addClass('active');
							
						},
						
						onResized: function(e) {
							if (!$dots.length || e.page.count < 2) {
								$dots.html('');
								$parent.find('.js-next-slide, .js-prev-slide').addClass('_hide');
								return;
							} else {
								$parent.find('.js-next-slide, .js-prev-slide').addClass('_show');
							}
							
							var $dotsHTML = '';
							for(var i = 0; i < e.page.count; i++) {
								$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
							}
							
							if (!$dots.hasClass('_unchanged')) {
								$dots.html($dotsHTML);
							}
							$dots.find('.lp-dots-item').removeClass('active');
							$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
						},
						onTranslate: function(e) {
							$dots.find('.lp-dots-item').removeClass('active');
							$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
						}
			        });
			        
			        $parent.on('click', '.js-next-slide', function(e) {
						e.preventDefault();
						$slider.trigger('next.owl.carousel');
					});
	
					$parent.on('click', '.js-prev-slide', function(e) {
						e.preventDefault();
						$slider.trigger('prev.owl.carousel');
					});
	
					$parent.on('click', '.js-dot-item', function(e) {
						e.preventDefault();
						$slider.trigger('to.owl.carousel', [$(this).index()]);
					});
			    }
			    console.log($slider.owlCarousel);
			});
		}
	}
	
	lp_template.queue.lpPromo13 = function($self) {
	    var $slider = $self.find('.js-promo-13-slider');
	
	    if ($slider.length) {
	        $slider.each(function(){
	
	            var $this = $(this),
	                $parent = $this.closest('[data-block-layout]'),
	                $currentSlideBlock = $parent.find('.js-promo-13-current'),
	                $totalSlidesBlock = $parent.find('.js-promo-13-total'),
					$autoplay = $this.data('autoplay'),
					$infinite = $this.data('infinite'),
					$autoplaySpeed = $this.data('autoplay-speed'),
					$speed = $this.data('speed');
	
	
	            function changeProgressWidth($progressWidth) {
	                var $progressWidthBlock =  $parent.find('.js-promo-13-progress'),
	                	outerWidth = $progressWidthBlock.outerWidth(),
	                	innerWidth = $progressWidthBlock.innerWidth(),
	                	$progressMaxWidthBlock = outerWidth - innerWidth;
	                	
	                $progressWidthBlock.css('width', 'calc(' + $progressWidth + '%' + ' - ' + $progressMaxWidthBlock + 'px');
	            }
	
	            $this.on('init reInit', function(event, slick) {
	                var $totalSlides = slick.slideCount;
	
	                if($totalSlides > 1) {
	                    var $progressWidth = 1 /$totalSlides*100;
	                    $totalSlidesBlock.text($totalSlides);
	                    changeProgressWidth($progressWidth);
	                } else {
	                    $parent.find('.js-promo-13-progress-block').css('display', 'none')
	                }
	
	
	            });
	
	            $this.slick({
	                infinite: $infinite,
	                speed: $speed,
	                autoplay: $autoplay,
				    autoplaySpeed: $autoplaySpeed,
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                fade: true,
	                dots:false,
	                prevArrow: $parent.find('.lp-promo-13-slider__arrow--left'),
	                nextArrow: $parent.find('.lp-promo-13-slider__arrow--right')
	            });
	
	            $this.on('afterChange', function(event, slick, currentSlide){
	                var $currentSlide = currentSlide + 1,
	                    $totalSlides = slick.slideCount,
	                    $progressWidth = $currentSlide/$totalSlides*100;
	                $currentSlideBlock.text($currentSlide);
	                changeProgressWidth($progressWidth);
	            });
	
	        });
	    }
	}
	
	lp_template.queue.lpPromo16 = function($self) {
	    var $slider = $self.find('.js-promo-16-slider');

	    if ($slider.length) {
	        $slider.each(function(){
	
	            var $this = $(this),
	                $parent = $this.closest('[data-block-layout]'),
	                $currentSlideBlock = $parent.find('.js-promo-16-current'),
	                $totalSlidesBlock = $parent.find('.js-promo-16-total'),
					$autoplay = $this.data('autoplay'),
					$infinite = $this.data('infinite'),
					$autoplaySpeed = $this.data('autoplay-speed'),
					$speed = $this.data('speed');
	
	            $this.on('init reInit afterChange', function(event, slick) {
	                var $totalSlides = slick.slideCount;
	
	                if($totalSlides > 1) {
	                    $totalSlidesBlock.text($totalSlides);
	                } else {
	                    $('.js-promo-16-progress-block').css('display', 'none')
	                }
	            });
	
	            $this.on('afterChange', function(event, slick, currentSlide){
	                var $currentSlide = currentSlide + 1;
	                $currentSlideBlock.text($currentSlide);
	            });
	
	            $this.slick({
	                infinite: $infinite,
	                speed: $speed,
	                autoplay: $autoplay,
				    autoplaySpeed: $autoplaySpeed,
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                fade: true,
	                dots:false,
	                prevArrow: $parent.find('.lp-promo-16-slide__arrow--left'),
	                nextArrow: $parent.find('.lp-promo-16-slide__arrow--right')
	            });
	        });
	    }
	}
	
	lp_template.queue.lpProducts39 = function($self) {
		var $block = $self.hasClass('lp-prods-39') ? $self : $self.find('.lp-prods-39');
			
		if ($block.length) {
			var func = function() {
				$block.each(function(){
					var $this = $(this);
					if (window.matchMedia('(min-width: 1200px)').matches) {
						$this.find('.lp-prods-39__subblock').each(function(index) {
							var item = $(this).find('.lp-prods-39__item:first-child()'),				
									itemHeight = item.height() + 2*parseInt(item.css('border-width'));					
			
							$(this).find('.lp-prods-39__title-wrap').css('min-height', itemHeight);
			
						});
					} else {
						$this.find('.lp-prods-39__title-wrap').css('min-height', '');
					}
				});
			};
			
			$(window).on('resize', func);
			if (s3LP.is_cms) {
				setTimeout(function(){
					LpController.afterSave(function () {
					    func();
					});
				},1000);
			}
		}
	}
	
	lp_template.queue.lpContacts6 = function($self) {
		var $contactsBlock = $self.hasClass('js-contacts-6') ? $self : $self.find('.js-contacts-6');
			
		if ($contactsBlock.length) {
		    $contactsBlock.each(function() {
		
		        var $tab = $contactsBlock.find('.js-tab'),
		            $tabsBlock = $contactsBlock.find('.js-tabs'),
		            $contactsData = $contactsBlock.find('.js-contacts-data');
		
		        // Одинаковая высота у всех блоков
		
		        function setHeight() {
		            var maxHeight = $contactsData.eq(0).height();
		            $contactsData.each(function () {
		                if ( $(this).height() > maxHeight ) {
		                    maxHeight = $(this).height();
		                }
		            });
		            $contactsData.css('minHeight', maxHeight);
		
		            setTimeout(function(){
		                $contactsData.hide();
		                $contactsData.eq(0).addClass('_active');
		            }, 500);
		        }
		
		        // Табы
		
		        function tabsInit() {
		            $tab.on('click', function() {
		                $(this).addClass('_active').siblings().removeClass('_active');
		                $contactsData.removeClass('_active').eq($(this).index()).addClass('_active');
		                if ($contactsBlock.find('.lp-contacts-6-map').data('map-type') == 'yandex') {
		                	console.log($contactsData.eq($(this).index()).find('.js-lp-simple-map').data());
		                	$contactsData.eq($(this).index()).find('.js-lp-simple-map').data('ymaps').container.fitToViewport();
		                }
		            });
		        }
		
		        // Кастомный скролл
		
		        function scrollInit() {
		
		            // Показывать скролл, если он нужен
		            var widthSum = 0;
		            $tab.each(function () {
		                widthSum +=  +$(this).outerWidth(true)
		            })
		
		            if(widthSum > $tabsBlock.width()) {
		                baron({
		                    root: '.lp-contacts-6-scroll',
		                    scroller: '.lp-contacts-6-scroll__inner',
		                    bar: '.lp-contacts-6-scroll__bar',
		                    scrollingCls: '_scrolling',
		                    draggingCls: '_dragging',
		                    direction: 'h',
		
		                })
		            }
		        }
		
		        // Карты
		
		        setHeight();
		        tabsInit();
		        //scrollInit();
		
		    });
		}
	}
	
	lp_template.queue.lpReviews18 = function($self) {

	    var $block = $self.hasClass('lp-reviews-18') ? $self : $self.find('.lp-reviews-18');
	    if ($block.length) {
		    $block.each(function(){
			    var $this = $(this);
			    
					try {
						adjustHeight();
			
						$(window).on('resize', function(){				
							adjustHeight();
						});			  
					} catch(exception) {
						console.log(exception);
					}
			
				function adjustHeight() {
					if (window.matchMedia('(min-width: 960px)').matches) {
						var wrapTopPadding = parseInt($this.find('.lp-reviews-18__wrap').css('padding-top')),					
								headerHeight = $this.find('.lp-reviews-18__header').height(),				
								imgHeight = $this.find('.lp-reviews-18__bg-img').height(),
								top = wrapTopPadding + headerHeight,					
								contentMinHeight = imgHeight + headerHeight;								
						
						$this.find('.lp-reviews-18__bg-img').css({top: top});
						$this.find('.lp-reviews-18__content').css({minHeight:contentMinHeight});			
					} else {
						$this.find('.lp-reviews-18__bg-img').css({top: ''});
						$this.find('.lp-reviews-18__content').css({minHeight: ''});			
					}
				};
				
				setTimeout(function(){
					LpController.afterSave(function () {
					    $(window).trigger('resize');
					});
				},3000);
		    });
	    }
	}
	
	lp_template.queue.lpReviews19 = function($self) {

	    var $block = $self.hasClass('lp-reviews-19') ? $self : $self.find('.lp-reviews-19');
	    
	    $block.each(function(){
		    var $this = $(this);
		    
				try {
					setTimeout(function(){
						imgHeight();
					},3000);
					
					$(window).on('resize', function(){				
						setTimeout(function(){
							imgHeight();
						},300);
					});
					
					setTimeout(function(){
						LpController.afterSave(function () {
						    imgHeight();
						});
					},3000);
					
				} catch(exception) {
					console.log(exception);
				}
		
			function imgHeight() {
				if (window.matchMedia('(min-width: 960px)').matches) {
					var topHeight = $this.find('.lp-reviews-19__top').height();
					
					$this.find('.lp-reviews-19__block-img').css({height: topHeight});
								
				} else {
					$this.find('.lp-reviews-19__block-img').css({height: ''});
				}
			};
	    });
	}
	
	
	lp_template.queue.lpVideo17 = function($self) {
	    var $block = $self.hasClass('lp-video-17') ? $self : $self.find('.lp-video-17');

	    if ($block.length) {
	        $block.each(function(){
	        	var $this = $(this),
	        		$sliderBig = $this.find('.lp-video-17__slider-big'),
	        		slider_thumbs = $this.find('.lp-video-17__slider-thumbs'),
	        		$nav = !!slider_thumbs.data('arrows'),
					$dot = !!slider_thumbs.data('dots'),
					$autoplay = !!$sliderBig.data('autoplay'),
					$infinite = $sliderBig.data('infinite'),
					$autoplaySpeed = $sliderBig.data('pause'),
					$speed = $sliderBig.data('speed');

				try {

				    initSlick();
					
				} catch(exception) {
					console.log(exception);
				}

				function initSlick() {
					$this.find('.lp-video-17__slider-big').slick({
						infinite: $infinite,
		                speed: $speed,
						vertical: false,
						verticalSwiping: true,
						slidesPerRow: 1,
						slidesToShow: 1,
						slidesToScroll: 1,			
						asNavFor: $this.find('.lp-video-17__slider-thumbs'),
						arrows: false,
						fade: true,
						dots: false,
						adaptiveHeight: true,
						draggable: true,			
						responsive: [
							{
								breakpoint: 1200,
								settings: {
									vertical: false,
									fade: true,
									cssEase: 'ease',
									verticalSwiping: false,
								}
							},
							{
								breakpoint: 600,
								settings: {
									vertical: false,
									verticalSwiping: false,
									dots: true,
									arrows: true,
									appendArrows: $this.find('.lp-video-17__big-controls'),
									prevArrow: '<button data-has-event="1" data-elem-type="container" data-lp-selector=".lp-video-17__arrow" class="lp-video-17__arrow lp-video-17__arrow-prev js-prev-item _primary-fill _svg-light-fill"><div data-elem-type="container" class="arrow-line-wr" data-lp-selector=".arrow-line"><div class="arrow-line"></div><div class="arrow-line"></div></div></button>',
									nextArrow: '<button data-has-event="1" data-elem-type="container" data-lp-selector=".lp-video-17__arrow" class="lp-video-17__arrow lp-video-17__arrow-next js-next-item _primary-fill _svg-light-fill"><div data-elem-type="container" class="arrow-line-wr" data-lp-selector=".arrow-line"><div class="arrow-line"></div><div class="arrow-line"></div></div></button>',
									appendDots: $this.find('.lp-video-17__big-dots'),						
								}
							}
						]
					});
				
					$this.find(".lp-video-17__slider-thumbs").slick({
						infinite: $infinite,
		                speed: $speed,
		                autoplay: $autoplay,
					    autoplaySpeed: $autoplaySpeed,
						vertical: true,
						verticalSwiping: true,
						slidesPerRow: 1,
						slidesToShow: 4,	
						asNavFor: $this.find('.lp-video-17__slider-big'),
						focusOnSelect: true,
						arrows: true,
						dots: true,
						adaptiveHeight: true,
						appendArrows: $this.find('.lp-video-17__thumbs-controls'),			
						appendDots: $this.find('.lp-video-17__thumbs-dots'),
						prevArrow: '<button data-has-event="1" data-elem-type="container" data-lp-selector=".lp-video-17__arrow" class="lp-video-17__arrow lp-video-17__arrow-prev js-prev-item _primary-fill _svg-light-fill"><div data-elem-type="container" class="arrow-line-wr" data-lp-selector=".arrow-line"><div class="arrow-line"></div><div class="arrow-line"></div></div></button>',
						nextArrow: '<button data-has-event="1" data-elem-type="container" data-lp-selector=".lp-video-17__arrow" class="lp-video-17__arrow lp-video-17__arrow-next js-next-item _primary-fill _svg-light-fill"><div data-elem-type="container" class="arrow-line-wr" data-lp-selector=".arrow-line"><div class="arrow-line"></div><div class="arrow-line"></div></div></button>',
						responsive: [
							{
								breakpoint: 1200,
								settings: {
									vertical: false,
									slidesToShow: 3,
									slidesPerRow: 1,
									infinite: $infinite,
									slidesToScroll: 3,	
									verticalSwiping: false,
								}
							},
							{
								breakpoint: 960,
								settings: {
									vertical: false,				
									slidesPerRow: 1,
									slidesToShow: 2,
									slidesToScroll: 1,
									infinite: $infinite,
									verticalSwiping: false,
								}
							},
						]
					});
				};
				
				$(window).on('resize', function(){
					setTimeout(function(){
						var $dotItem = $block.find('.lp-video-17__thumbs-dots li button');
						if ($dotItem.hasClass('lp-video-17__slider-dot')) {
							
						}
						else {
							$dotItem.attr('data-elem-type', 'card_container');
							$dotItem.addClass('lp-video-17__slider-dot');
							$dotItem.attr('data-lp-selector','.lp-video-17__slider-dot');
							$dotItem.attr('data-has-event','1');
						}
					},500);
				});
			});
	    }
	}
	
	lp_template.queue.lpSteps7 = function($self) {
	    var $block = $self.find('.js-simple-tabs');

	    if ($block.length) {
	        $block.each(function(){
	        	var $this = $(this);
	        	if (!s3LP.is_cms) {
			        $this.bind('mousewheel', function(e){
				        if(e.originalEvent.wheelDelta /120 > 0) {
				            $this.find('.active:not(:first-child)').removeClass('active').delay(800).prev().addClass('active').delay(800);
				        }
				        else{
				            $this.find('.active:not(:last-child)').removeClass('active').delay(800).next().addClass('active').delay(800);
				        }
				        
	    				if ($this.find('.count').last().hasClass('active') || $this.find('.count').first().hasClass('active')) {
	    					return;
	    				}
	    				else {
	    					e.stopPropagation();
	    					e.preventDefault();
	    				}
				    });
	        	}
	        	
			  $('.js-tab').on('click', function(){
				    var $index = $(this).index() + 1;
				    $this.find('.js-tab-content:nth-child(' + $index + ')').addClass('active').siblings().removeClass('active');
				    $(this).addClass('active').siblings().removeClass('active')
				});
	        });
	    }
	}
	
	lp_template.queue.lpMenu20 = function($self) {
	    var $block = $self.find('.js-phone-btn');

	    if ($block.length) {
	        $block.each(function(){
	        	var $this = $(this);
	        	
	        	$this.on('click', function(){
				    $(this).siblings('.js-phone').toggleClass('active');
				});
				
				if (!s3LP.is_cms) {
					$(document).mouseup(function (e){
					    var div = $(".lp-menu-20-phone");
					    if (!div.is(e.target)
					        && div.has(e.target).length === 0) {
					        div.find('.js-phone').removeClass('active');
					    }
					});
				}
	        });
	    }
	}
	
	lp_template.queue.lpCertificate19 = function($self) {
		var $block = $self.hasClass('lp-certificate-19') ? $self : $self.find('.lp-certificate-19');
		
		if ($block.length) {
			$block.each(function(){	
				var $this = $(this),
					$mainSlider = $this.find('.js-main-slick'),
			    	$thumbSlider = $this.find('.js-thumb-slick'),
			    	$prevBtn = $this.find('.js-slider-prev'),
			    	$nextBtn = $this.find('.js-slider-next'),
					$dots = !!$mainSlider.data('dots'),
					$arrows = !!$mainSlider.data('arrows'),
					$autoplay = $mainSlider.data('autoplay'),
					$infinite = $mainSlider.data('infinite'),
					$autoplaySpeed = $mainSlider.data('pause'),
					$speed = $mainSlider.data('speed');
				
			    $mainSlider.slick({
			        slidesToShow: 1,
			        slidesToScroll: 1,
			        arrows: false,
			        fade: true,
			        asNavFor: $thumbSlider,
			        infinite: $infinite,
			        speed: $speed,
			        autoplay: $autoplay,
				    autoplaySpeed: $autoplaySpeed,
			        adaptiveHeight: false,
			        responsive: [
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 1,
			                    arrows: $arrows
			                }
			            }
			        ]
			    })
			
			    $thumbSlider.slick({
			        slidesToShow: 5,
			        slidesToScroll: 1,
			        asNavFor: $mainSlider,
			        dots: $dots,
			        dotsClass:'lp-certificate-19__thumbs-dots-in',
			        appendDots:$this.find('.lp-certificate-19__thumbs-dots'),
			        infinite: $infinite,
			        speed: $speed,
			        autoplay: $autoplay,
				    autoplaySpeed: $autoplaySpeed,
			        centerMode: false,
			        arrows: $arrows,
			        touches: true,
			        prevArrow: $prevBtn,
			        nextArrow: $nextBtn,
			        focusOnSelect: true,
			        adaptiveHeight: false,
			        centerPadding: '6px',
			        mobileFirst: true,
			        swipeToSlide: false,
			        responsive: [
			            {
			                breakpoint: 600,
			                settings: {
			                    slidesToShow: 4,
			                    centerPadding: '20px'
			                }
			            },
			            {
			                breakpoint: 960,
			                settings: {
			                    slidesToShow: 4,
			                    arrows: true,
			                    centerPadding: '0px'
			                }
			            },
			            {
			                breakpoint: 1380,
			                settings: {
			                    slidesToShow: 5,
			                    arrows: true,
			                    centerPadding: '0px'
			                }
			            }
			        ]
			    });
			    
			    $(window).on('resize', function(){
		        	setTimeout(function(){
		        		var $dotItem = $this.find('.lp-certificate-19__thumbs-dots li button');
		        		if ($dotItem.hasClass('lp-certificate-19__thumbs-dot')) {
		        			
		        		}
		        		else {
					        $dotItem.attr('data-elem-type', 'card_container');
					        $dotItem.addClass('lp-certificate-19__thumbs-dot');
					        $dotItem.attr('data-lp-selector','.lp-certificate-19__thumbs-dot');
					        $dotItem.attr('data-has-event','1');
		        		}
		        	},500);
		        });
			});
	    }
	};
	
	lp_template.queue.lpPartners15 = function($self) {
		
		var $block = $self.hasClass('lp-partners-15') ? $self : $self.find('.lp-partners-15');
		
		$block.each(function(){
			if ($block.length) {
				var $this = $(this),
					$slider = $this.find('.lp-partners-15-items.js-owl-carousel'),
					autoplay = !!$slider.data('autoplay'),
					infinite = !!$slider.data('infinite'),
					nav = !!$slider.data('arrows'),
					dotsEach = !!$slider.data('dots-each'),
					dots = true,
					pause = $slider.data('pause') || 5000,
					speed = $slider.data('speed') || 250,
					fade = !!$slider.data('fade'),
					$parent = $slider.closest('[data-block-layout]'),
					dataResponse = $slider.data('response'),
					response = {},
					$dots = $this.find('.lp-dots-wrapper');
				
				
				try {
					let owl = $slider,
						windowWidth = $(window).width(),
						gridFormer = function(){
						let wrapper = '<div class="lp-partners-15-items-grid"></div>',
							itemsCount = $this.find('.lp-partners-15-items>.lp-partners-15-item').length,
							sliceFunc = function(itemsInGrid){
								for (var i = 0; i < itemsCount/itemsInGrid; i++) {
									$this.find('.lp-partners-15-items>.lp-partners-15-item').slice(0, itemsInGrid).wrapAll(wrapper);
								}
								$this.find('.lp-partners-15-items-grid').each(function(){
									$(this).addClass('_'+$(this).children().length);
								});
							};
		
						if (windowWidth>=600) {
							sliceFunc(4);					
						}
					}
		
					let initOwl = function(){
						owl.owlCarousel({
							dots: true,
							nav: true,
							mouseDrag: false,
							margin: 16,
							autoplay : autoplay,
							loop : infinite,
							smartSpeed: speed,
							autoplayTimeout: pause,
							items: 1,
							onInitialized: function(e) {
								var $dotsCount = $this.find('.owl-dot').length;
								
								if (!$dots.length || $dotsCount < 2) {
									$dots.html('');
									return;
								};
								var $dotsHTML = '';
								
								for(var i = 0; i < $dotsCount; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								} 
								
								if (!$dots.hasClass('_unchanged')) {
								
									$dots.html($dotsHTML);
								
								}
								
								$dots.find('.lp-dots-item').eq(0).addClass('active');
								
							},
							
							onResized: function(e) {
								if (!$dots.length || e.page.count < 2) {
									$dots.html('');
									return;
								}
								
								var $dotsHTML = '';
								for(var i = 0; i < e.page.count; i++) {
									$dotsHTML += '<div class="lp-dots-item js-dot-item" data-elem-type="container" data-lp-selector=".lp-dots-item"></div>';
								}
								
								if (!$dots.hasClass('_unchanged')) {
									$dots.html($dotsHTML);
								}
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							},
							onTranslated: function(e) {
								$dots.find('.lp-dots-item').removeClass('active');
								$dots.find('.lp-dots-item').eq(e.page.index).addClass('active');
							}
						});
						
						$this.find('.js-next-slide').off();
						$this.find('.js-next-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('next.owl.carousel');
						});
						$this.find('.js-prev-slide').off();
						$this.find('.js-prev-slide').on('click', function(e) {
							e.preventDefault();
							owl.trigger('prev.owl.carousel');
						});
						
						$this.find('.js-dot-item').on('click', function(e) {
							e.preventDefault();
							owl.trigger('to.owl.carousel', [$(this).index()]);
						});
						
					}
		
					let reInitOwl = function(){
						owl.trigger('destroy.owl.carousel');
						if (windowWidth<600) {
							$this.find('.lp-partners-15-item').unwrap();
						}				
						gridFormer();
						initOwl();
					}
		
					gridFormer();
					
			        initOwl();
		
		
					$(window).resize(function(){				
						let newWindowWidth = $(window).width();
						if (windowWidth<600){
							if (newWindowWidth>=600) {
								windowWidth = newWindowWidth;
								reInitOwl();
							}
						} else if (windowWidth>=600){
							if (newWindowWidth<600) {
								windowWidth = newWindowWidth;
								reInitOwl();
							}
						}
					});
		
				} catch(exception) {
					console.log(exception);
				}
			}
		});
	}
	
	lp_template.queue.lpStaff7 = function($self) {
		
		var $block = $self.hasClass('lp-staff-7') ? $self : $self.find('.lp-staff-7');
		
		$block.each(function(){
			if ($block.length) {
				var $this = $(this);
				
				try {
					$this.find('.lp-header-tab').not('._active').on('click', function(){
						$(this).addClass('_active').siblings().removeClass('_active');
			  			$('.lp-staff-7 .lp-staff-body-items').removeClass('_active').eq($(this).index()).addClass('_active');
					});
		
					$this.find('.lp-header-tab').first().addClass('_active');
					$this.find('.lp-staff-body-items').first().addClass('_active');
		
				    var widthSum = 0;
				    $this.find('.lp-header-tab').each(function () {
				        widthSum +=  +$(this).outerWidth(true)
				    })
		
				    if(widthSum > $('.lp-header-tabs').width()) {
				        baron({
				            root: '.lp-staff-7-scroll',
				            scroller: '.lp-staff-7-scroll__inner',
				            bar: '.lp-staff-7-scroll__bar',
				            scrollingCls: '_scrolling',
				            draggingCls: '_dragging',
				            direction: 'h',
		
				        })
				    }
		
				} catch(exception) {
					console.log(exception);
				}
			}
		});
	}
	
	lp_template.queue.lpForm29 = function($self) {
		var $block = $self.hasClass('lp-form-29') ? $self : $self.find('.lp-form-29');

		if ($block.length) {

			$block.each(function() {
				var $this = $(this);
		
				try {      
						setMinHeight();
						$(window).on('resize', function(){
						setMinHeight();        
					});      
				} catch(exception) {
					console.log(exception);
				}
				
				function setMinHeight() {
					if (window.matchMedia('(min-width: 960px)').matches) {
						var formHeight = $this.find('.lp-form-29__form').height() 
						+ parseInt($this.find('.lp-form-29__form').css('padding-top'))
						+ parseInt($this.find('.lp-form-29__form').css('padding-bottom')),
						minHeight = formHeight - 160;
				
						$this.find('.lp-form-29__top').css({
							minHeight : minHeight           
						});
						
						var topHeight = $this.find('.lp-form-29__top').height();
						
						if (topHeight > (formHeight + 40)) {
							$this.find('.lp-form-29__top').css({'margin-top' : '40px'});
						} else {
							$this.find('.lp-form-29__top').css({'margin-top' : ''});
						}
					} else {
						$this.find('.lp-form-29__top').css({
							minHeight : '',
							'margin-top' : ''          
						});
					}
				};
			});
		}		
	};
	
	lp_template.queue.lpFeatures29 = function($self) {
	    var $block = $self.find('.lp-features-29-item__percentage');
	    if ($block.length) {
	        function perc() {
		        $block.each(function(){
		            var $this = $(this),
		            	$parent = $this.closest('.lp-features-29-item'),
		            	$inner = $parent.find('.lp-features-29-item__field-inner'),
		            	$percent = Number.isNaN(parseInt($this.text())) ? 0 : parseInt($this.text()),
		            	$percent = $percent < 101 ? $percent : 100;
					
					$inner.css('width', $percent + '%');
					$this.text($percent + '%');
		        });
	        }
						    
			if (s3LP.is_cms) {
				setTimeout(function(){
					LpController.afterSave(function () {
						perc();
					});
				},1000);
			}
	    }
	}
	
	lp_template.queue.scrollTop = function($self) {
		var $block = $self.find('.scrollHide');
		if ($block.length) {
			var $this = $(this),
				$scrollBtn = $self.find('.js-19-elem');
			$(window).on('scroll', function(){
				var $scrollTop = $(this).scrollTop();
				if ($scrollTop > 500) {
					$scrollBtn.addClass('_show');
					console.log($scrollBtn);
				}
				else {
					$scrollBtn.removeClass('_show');
					console.log('-');
				}
			});
		}
	}
	
	lp_template.queue.minHeight = function($self) {
		var $block = $self.find('.js-min-height'),
			func = function() {
				$block.each(function(){
					var $this = $(this),
						$title = $this.find('.js-item'),
						$border = $this.find('._title'),
						minWidth = $this.data('min-width') || 0,
						minHeight = $title.eq(0).height();
						
					$border.css({
						minHeight: 0
					});
					
					if ($(window).width() >= minWidth) {
						$title.each(function(){
							var thisHeight = $(this).height();
							
							if (minHeight > thisHeight) {
								minHeight = thisHeight;
							}
						});	
						
						$border.css({
							minHeight: minHeight
						});
					}
				});
			};
			
		$(window).on('resize', func);
		if (s3LP.is_cms) {
			setTimeout(function(){
				LpController.afterSave(function () {
				    func();
				});
			},1000);
		}
	}
	
	lp_template.queue.animatedAnchor = function($self) {
		var $block = $self;
		
		if ($(".js-19-elem").length) {
			$block.find(".js-19-elem").on('click touch', function(e){
				e.preventDefault();
				$('html, body').animate({
			        scrollTop: $("body").offset().top
			    }, 2000);
			});
		}
	}
	
	lp_template.queue.previewModeIsCms = function($self) {
		setTimeout(function(){
			if ($('body').hasClass('preview_mode')) {
				$('._is-cms').removeClass('_is-cms');
			}
		}, 2000);
	}
	
	
	lp_template.queue.fixedMenu = function($self) {
		var $block = $self.hasClass('js-fixed-menu') ? $self : $self.find('.js-fixed-menu');
		var $fixedElem = $block.find('._fixed-element');
		
		$block.data('isFixed', false);
		
		$fixedElem = $fixedElem.length ? $fixedElem : $block;
		
		$block.each(function(){
			var $this = $(this);
			
			$this.data('topPosition', $this.offset().top);
		});
		
		if ($block.length) {
			$win.on('scroll', function(e){
				$block.each(function(){
					var $this = $(this),
						isAfterScroll = !!$this.data('after-scroll'),
						$thisBurger = $this.find('.js-burger'),
						$fixedElem = $this.find('._fixed-element');
					
					$fixedElem = $fixedElem.length ? $fixedElem : $this;
					
					var position = $this.data('isFixed') ? $fixedElem[0].parentNode.getBoundingClientRect() : this.getBoundingClientRect();
					
					if ( !$this.data('isFixed') && ((!isAfterScroll && position.top <= 0) || (isAfterScroll && position.top <= 0 - $this.outerHeight()))) {
						if (!s3LP.is_cms) {	
							$fixedElem.wrap('<div class="fixed-element-wrap"></div>');
							$(window).on('resize', function(){
									$fixedElem.closest('.fixed-element-wrap').height($fixedElem.height());
							});
							$win.trigger('resize');
							//$fixedElem.closest('.fixed-element-wrap').height($fixedElem.height());
							$fixedElem.addClass('_to-fix-menu');
							$this.data('isFixed', true);
							if ($thisBurger.hasClass('add_in-side')) $thisBurger.addClass('_in-side');
						}
					} else if ($this.data('isFixed') && (position.top > 0 || (isAfterScroll && $win.scrollTop() < $this.data('topPosition')))) {
						$fixedElem.removeClass('_to-fix-menu');
						$this.data('isFixed', false);
						$thisBurger.removeClass('_in-side');
						$win.trigger('resize');
						$fixedElem.unwrap();
					}
				});
			}).trigger('scroll');
		}
	};
	
	lp_template.queue.autoplayVideo = function($self) {
		var $block = $self.find('[data-autoplay-video="1"]');
	
		if ($block.length) {
			$block.on('autoplayVideo', function(e, type, nodeName) {
				var video = this.querySelector(nodeName);
				
				if (nodeName === 'video') {
					if (type === 'play') {
						video.play();
					} else {
						video.pause();
					}					
				} else if (nodeName === 'iframe') {
					var video = $(video).data('youtube');
					if (type === 'play') {
						video.playVideo();
					} else {
						video.pauseVideo();
					}
				}
			});
		}
	}
	
	window.lp_init = function($block) {
	
		var $autoplayVideo = $doc.find('[data-autoplay-video="1"]');
		
		if ($autoplayVideo.length && !s3LP.is_cms) {
			$win.on('scroll', function() {
				lp_template.checkAutoplayVideo($autoplayVideo);
			});
		}
	
		Object.keys(lp_template.queue).forEach(function(func) {
			var thisFunction = lp_template.queue[func];
			if (typeof thisFunction == 'function') {
				thisFunction($block);
			}
		});
		
		$win.trigger('resize');
		
		setTimeout(function() {
			$win.trigger('resize');
		}, 700);
		
		$.getScript("/g/s3/misc/animator/1.1.0/js/s3.animator.js", function(){
			$('body').append('<link rel="stylesheet" type="text/css" href="/g/s3/misc/animator/1.0.0/css/s3.animator.scss.css">');
			s3Animator.once = true;
		});
		
		setTimeout(function() {
			$win.trigger('scroll');
		}, 2000);
		
	}

	window.onYouTubeIframeAPIReady = function() {
		$(function(){
			var listYoutube = $('.js-lp-video-youtube');
			
			listYoutube.each(function(){
				var $this = $(this),
					isFullFrame = $this.hasClass('_not-paused');
				
				var player = new YT.Player(this.id, {
					iv_load_policy: 3,
					modestbranding: 1,
					rel: 0,
					mute: isFullFrame ? 1 : 0,
					playsinline: 1,
					showinfo: isFullFrame ? 0 : 1,
					events: {
						'onStateChange': function(event) {
							if (event.data == YT.PlayerState.ENDED && isFullFrame) {
								event.target.playVideo();
							}
						}
					}
				});
	
				$this.data('youtube', player);
			});
		});
	}
	
	function isElementInViewport(el) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top <= window.innerHeight-200 &&
			rect.bottom >= 50
		);
	}

})();