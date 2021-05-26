(function($) {
	
	"use strict";
	
	/* Default Variables */
	var Sena_Options = {
		parallax:true,
		loader:true,
		animations:true,
		scrollSpeed:700,
		navigation:'sticky',	//sticky, default
		zoomControlDiv:null,
		mapColor:'',
		mapMarker:'',
		security:''
	};
	
	if (typeof Sena!=='undefined') {
		jQuery.extend(Sena_Options, Sena);
	}
	
	$.Sena_Theme = {
		
		//Initialize
		init:function() {
			this.loader();
			this.animations();
			this.navigation();
			this.searchWrapper();
			this.scrollTop();
			this.intro();
            this.portfolio();
			this.parallax();
            this.contact();			
			this.videos();
			this.imageSlider();
			this.contentSlider();
			this.blog();
            this.shop();
			this.errorPage();            
			this.shortCodes();
			this.replace();
			this.map();
		},
		
		//Check if tocuh device
		isTouch:function() {
			return ('ontouchstart' in document.documentElement);
		},
		
		//Page Loader
		loader:function() {
			if (Sena_Options.loader) {
				var loaderHide = function() {
					jQuery(window).trigger('sena.loaded');
					
					jQuery('.page-loader').delay(1000).fadeOut('slow', function() {
						jQuery(window).trigger('sena.complete');
					});
				};
	
				//Loadsafe
				jQuery(window).on('load', function() {
					window._loaded = true;
				});
				
				window.loadsafe = function(callback) {
					if (window._loaded) {
						callback.call();
					} else {
						jQuery(window).on('load', function() {
							callback.call();
						});
					}
				};
	
				//Hide loader
				if (jQuery('#intro').attr('data-type')==='video' && !this.isTouch()) {
					jQuery(window).on('sena.intro-video', function() {
						window.loadsafe(function() {
							loaderHide();
						});
					});
				} else {
					jQuery(window).on('load', function() {
						loaderHide();
					});
				}
			} else {
				jQuery('.page-loader').remove();
				jQuery(window).trigger('sena.loaded');	
                
                setTimeout(function() {
                    jQuery(window).trigger('sena.complete');
                }, 1);
			}
		},
		
		//Animations
		animations:function() {
			new WOW().init();
		},
	
		//Navigation
		navigation:function() {
			//Line height
			jQuery('.navbar .navbar-brand img').waitForImages(function() {
				try {
					var height = parseInt(jQuery(this).height(), 10);
					if (height<25) {height = 25;}
					
					jQuery('.navbar .navbar-nav > li > a, .navbar .navbar-icon').css('line-height', height+'px');

					//Responsive menu
					var $toggle = jQuery('.navbar .navbar-toggle'),
						toggle_height = parseInt($toggle.height(), 10);

					jQuery('.navbar .navbar-header').css('height', height+'px');
					$toggle.css('margin-top', parseInt((height-(toggle_height+2))/2, 10)+'px');
				} catch(err) {
					console.log(err.message);
				}
			});
			
			//Dropdown menu
			var dropdownHide = function() {
				if (jQuery('.navbar .dropdown.open').length===0) {return;}
				
				jQuery('.navbar .dropdown.open').each(function() {
					var $menu = jQuery(this);
					
					if (!$menu.hasClass("active")) {
						$menu.removeClass('open');
					}
					
					$menu.find('.dropdown-menu').animate({opacity:0}, {duration:150, queue:false});
				});
			};
			
			var dropdownShow = function($that) {
				$that.find('.dropdown-menu').css({opacity:0});
				$that.addClass('open').find('.dropdown-menu').animate({opacity:1}, {duration:150, queue:false});
			};
	
			//Collapse menu
			var collapseMenu = function() {
				if (jQuery('.navbar-collapse.collapse.in').length>0) {
					jQuery('.navbar-collapse.collapse.in').each(function() {
						jQuery(this).parent().find('.navbar-toggle').click();
					});
				}
			};
	
			//Resize window
			jQuery(window).on('resize', function() {
				collapseMenu();
				dropdownHide();
			});
	
			jQuery(window).on('scroll', function() {
				collapseMenu();
			});
	
			//Navbar toggle
			jQuery('.navbar .navbar-toggle').on("click", function(e) {
				e.preventDefault();
				dropdownHide();
			});
	
			//Create floating navigation bar
			if (Sena_Options.navigation==='sticky') {
				//Floating menu
				jQuery(window).on("scroll", function() {
					var pos = jQuery(window).scrollTop();
					
					if (pos>=100) {
						jQuery(".navbar").addClass("floating slide-down");
					} else {
						jQuery(".navbar").removeClass("floating slide-down");
					}
				});
			} else {
				//Fixed menu
				jQuery('.navbar').addClass('fixed-top');
			}
	
			//Dropdown menu
			var dropdownTimer, dropdownExists = false;
			
			jQuery('.dropdown').hover(function() {
				if (!jQuery(this).parent().parent().hasClass('in') && !jQuery(this).parent().parent().hasClass('collapsing')) {
					clearTimeout(dropdownTimer);
					if (jQuery(this).hasClass('open')) {return;}
					if (dropdownExists) {dropdownHide();}
					dropdownExists = true;
					dropdownShow(jQuery(this));
				}
			}, function() {
				if (!jQuery(this).parent().parent().hasClass('in')) {
					dropdownTimer = setTimeout(function() {
						dropdownHide();
						dropdownExists = false;
					}, 500);
				}
			});
			
			jQuery(document).on('click', '.navbar-collapse.in .dropdown > a', function(e) {
				e.preventDefault();
				var $parent = jQuery(this).parent();
				
				if (!$parent.hasClass('open')) {
					dropdownShow($parent);
				} else {
					dropdownHide();
				}
			});
	
			//Scroll to anchor links
			jQuery('a[href^=\\#]').on("click", function(e) {
				if (jQuery(this).attr('href')!=='#' && !jQuery(e.target).parent().parent().is('.navbar-nav') && !jQuery(this).attr('data-toggle')) {
					jQuery(document).scrollTo(jQuery(this).attr('href'), Sena_Options.scrollSpeed, {offset:{top:-85, left:0}});
					e.preventDefault();
				}
			});
	
			//Navigation
			jQuery(document).ready(function() {
				jQuery('.navbar-nav').onePageNav({
					currentClass:'active',
					changeHash:false,
					scrollSpeed:Sena_Options.scrollSpeed,
					scrollOffset:85,
					scrollThreshold:0.5,
					filter:'li a[href^=\\#]',
					begin:function() {
						collapseMenu();
					}
				});
			});
	
			if (document.location.hash && Sena_Options.loader) {
				if (!/\?/.test(document.location.hash)) {
					jQuery(window).on('load', function() {
						jQuery(window).scrollTo(document.location.hash, 0, {offset:{top:-85, left:0}});
					});
				}
			}
	
			//To top
			jQuery('footer .to-top').on('click', function() {
				jQuery(window).scrollTo(jQuery('body'), 1500, {offset:{top:0, left:0}});
			});
		},
		
		//Search wrapper
		searchWrapper:function() {
			if (jQuery('.search-wrapper').length===0) {
				return;
			}
			
			var $search = jQuery('.search-wrapper'),
				$searchIcon = jQuery('.navbar-search'),
				$closeBtn = jQuery('.search-close-btn');
			
			$searchIcon.on("click", function(e) {
				e.preventDefault();
				$search.addClass('wrapper-active');
			});

			$closeBtn.on("click", function(e) {
				e.preventDefault();
				$search.removeClass('wrapper-active');
			});
		},
		
		//Scroll top
		scrollTop:function() {
			if (jQuery('#scrollTop').length===0) {
				return;
			}
			
			var scrollPage = function() {
				var $scrollTop = jQuery('#scrollTop');
			
				if ($scrollTop.length>0) {
					var scrollOffset = 200;

					if (jQuery(window).scrollTop()>scrollOffset) {
						if (jQuery('body').hasClass('frame')) {
							$scrollTop.css({
								"bottom":'36px',
								"opacity":1,
								"z-index":199
							})
						} else {
							$scrollTop.css({
								"bottom":'18px',
								"opacity":1,
								"z-index":199
							})
						}
					} else {
						$scrollTop.css({
							bottom:'16px',
							opacity:0
						})
					}

					$scrollTop.on('click', function() {
						jQuery('html, body').stop(true, false).animate({scrollTop:0}, 1000);
						return false;
					})
				}
			};
			
			jQuery(window).on('scroll', function() {
				scrollPage();
			});
		},
	
		//Intro
		intro:function() {
			if (jQuery('#intro').length===0) {
				return;
			}
	
			var $intro = jQuery('#intro');
			var useImages = false, useVideo = false;
			var $elements;
	
			//Vertical Align Content
			var verticalAlignContent = function() {
				var contentH = $intro.find('.caption').height(), 
					windowH = jQuery(window).height(), 
					value = (windowH-contentH)/2;
				
				$intro.find('.content').css({marginTop:Math.floor(value)});
			};
	
			//Magic mouse
			var magicMouse = function() {
				var mouseOpacity = 1-jQuery(document).scrollTop()/400;
				if (mouseOpacity<0) {mouseOpacity = 0;}
				$intro.find('.mouse').css({opacity:mouseOpacity});
			};
	
			if (!Sena_Options.animations) {
				$intro.find('.wow').removeClass('wow');
			}
	
			jQuery(window).on('resize', function() {
				verticalAlignContent();
			});
	
			jQuery(window).on('load', function() {
				verticalAlignContent();
				magicMouse();
			});
			
			jQuery(window).on('scroll', function() {
				magicMouse();
			});
	
			//Static image
			if ($intro.data('type')==='single-image') {
				useImages = true;
				$elements = $intro.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();
	
					jQuery(window).on('sena.complete', function() {
						$elements.removeClass('animated');
						$elements.removeAttr('style');
						
						new WOW({boxClass:'animate'}).init();
					});
				} else {
					verticalAlignContent();
				}
	
				jQuery('<div />').addClass('slider fullscreen').prependTo('body');
				
				if (jQuery('div.image').length>0) {
                    jQuery('div.image').css({
                        opacity:0,
                        backgroundImage:"url('"+jQuery('div.image').data('source')+"')",
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'cover'
                    }).appendTo('.slider');
                }
	
				jQuery('.slider').waitForImages(function() {
					jQuery(this).find('.image').css({opacity:1});
				});
	
				if ($intro.attr('data-parallax')==='true' && !this.isTouch()) {
					jQuery(document).ready(function() {
						jQuery('.slider').find('.image').css({backgroundRepeat:'repeat'}).parallax('50%', 0.25);
					});
				}			
			}		
			//Slideshow
			else if ($intro.data('type')==='slideshow') {
                var $carousel = jQuery('.intro .intro-slideshow');
				useImages = true;
                
                //Background image from data background
                jQuery(".bg-img").each(function() {
                    if (jQuery(this).data('bg')) {
                        jQuery(this).css('background-image', 'url('+jQuery(this).data('bg')+')');
                    }
                });
				
				//Animation
				var animation = $intro.data('animation');
				
				var captionAnimation = function(e) {
					//Position of the current item
					var item = e.item.index-2;
					
					jQuery("h3").removeClass('animated '+animation);
					jQuery("h1").removeClass('animated '+animation);
					jQuery("p").removeClass('animated '+animation);
					jQuery(".btn").removeClass('animated '+animation);
					
					jQuery(".owl-item").not(".cloned").eq(item).find("h3").addClass('animated '+animation);
					jQuery(".owl-item").not(".cloned").eq(item).find("h1").addClass('animated '+animation);
					jQuery(".owl-item").not(".cloned").eq(item).find("p").addClass('animated '+animation);
					jQuery(".owl-item").not(".cloned").eq(item).find(".btn").addClass('animated '+animation);
				};
				
				//Init carousel
				$carousel.on('initialized.owl.carousel', function(e) {
					captionAnimation(e);
				});
				
				//Carousel
                $carousel.owlCarousel({
                    items:1,
                    loop:true,
                    nav:true,
                    margin:0,
                    autoplay:true,
                    autoplayTimeout:$carousel.data('delay')*1000,
                    smartSpeed:500,
					animateIn:'fadeIn',
                    animateOut:'fadeOut',
					navContainer:'.intro-nav .owl-arrows',
					dotsContainer:'.intro-nav .owl-dots'
                });
				
				//Change carousel
				$carousel.on('changed.owl.carousel', function(e) {
					captionAnimation(e);
				});
			}
			//Fullscreen Video
			else if ($intro.data('type')==='video') {
				useVideo = true;
	
				if (this.isTouch()) {
					jQuery('#video-mode').removeClass('animate').hide();
					useImages = true;
					useVideo = false;
				}
	
				$elements = $intro.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();
	
					jQuery(window).on('sena.complete', function() {
						$elements.removeClass('animated');
						$elements.removeAttr('style');
						
						new WOW({boxClass:'animate'}).init();
					});
				} else {
					verticalAlignContent();
				}
				
				jQuery(document).ready(function() {
					var reserveTimer,
						onlyForFirst = true;

					jQuery('[data-hide-on-another="true"]').remove();

					if (jQuery('.slider.fullscreen').length>0) {
                        var $video = jQuery('.slider.fullscreen');
                        
                        $video.prependTo('body').on('YTPStart', function() {
                            if (onlyForFirst) {
                                clearTimeout(reserveTimer);
                                jQuery(window).trigger('sena.intro-video');
                                onlyForFirst = false;
                            }
                        }).mb_YTPlayer({
                            onError:function() {
                                clearTimeout(reserveTimer);
                                jQuery(window).trigger('sena.intro-video');
                            }
                        });

                        if ($video.data('overlay')) {
                            jQuery('.YTPOverlay').css({
                                backgroundColor:'rgba(0, 0, 0, '+$video.data('overlay')+')'
                            });
                        }
                    }
				});

				var videoMode = false, 
					videoModeSelector = '#intro .mouse, #intro .content, .slider.fullscreen .overlay';

				jQuery('#video-mode').on("click", function() {
					jQuery(videoModeSelector).animate({opacity:0}, {duration:500, queue:false, complete:function() {
						if (!videoMode) {
							jQuery('.slider').YTPUnmute();
							
							jQuery('.YTPOverlay').animate({opacity:0}, {duration:500, queue:false, complete:function() {
								jQuery(this).hide();
							}});

							jQuery('<div />').appendTo('#intro').css({
								position:'absolute',
								textAlign:'center',
								bottom:'30px',
								color:'#fff',
								left:0,
								right:0,
								opacity:0
							}).addClass('click-to-exit');

							jQuery('<h5 />').appendTo('.click-to-exit').text('Click to exit full screen');

							setTimeout(function() {
								jQuery('.click-to-exit').animate({opacity:1}, {duration:500, queue:false, complete:function() {
									setTimeout(function() {
										jQuery('.click-to-exit').animate({opacity:0}, {duration:500, queue:false, complete:function() {
											jQuery(this).remove();
										}});
									}, 1500);
								}});
							}, 500);
						}

						videoMode = true;

						jQuery(this).hide();
					}});
				});

				$intro.on("click", function(e) {
					if (videoMode && jQuery(e.target).is('#intro')) {
						jQuery('.slider').YTPMute();
						jQuery('.YTPOverlay').show().animate({opacity:1}, {duration:500, queue:false});
						jQuery(videoModeSelector).show().animate({opacity:1}, {duration:500, queue: false});
						$intro.find('.click-to-exit').remove();
						videoMode = false;
					}
				});
			}
		},
        
        //Portfolio
		portfolio:function() {
			if (jQuery('.portfolio-item').length===0) {
				return;
			}
			
			var that = this;
	
			var calculatePortfolioItems = function() {
				var sizes = {lg:4, md:4, sm:4, xs:2}, 
                    $that = jQuery('.portfolio-items'),
					w = jQuery(window).width(), onLine = 0, value = 0;
	
				if ($that.attr('data-on-line-lg')>0) {sizes.lg = parseInt($that.attr('data-on-line-lg'), 10);}
				if ($that.attr('data-on-line-md')>0) {sizes.md = parseInt($that.attr('data-on-line-md'), 10);}
				if ($that.attr('data-on-line-sm')>0) {sizes.sm = parseInt($that.attr('data-on-line-sm'), 10);}
				if ($that.attr('data-on-line-xs')>0) {sizes.xs = parseInt($that.attr('data-on-line-xs'), 10);}
	
				if (w<=767) {
					onLine = sizes.xs;
				} else if (w>=768 && w<=991) {
					onLine = sizes.sm;
				} else if (w>=992 && w<=1199) {
					onLine = sizes.md;
				} else {
					onLine = sizes.lg;
				}
	
				value = Math.floor(w/onLine);
				jQuery('.portfolio-item').css({width:value+'px', height:value+'px'});
			};
	
			jQuery(window).on('resize', function() {
				calculatePortfolioItems();
			});
			
			jQuery(window).on('load', function() {
				calculatePortfolioItems();
				
				//Isotope
				jQuery('.portfolio-items').isotope({
					itemSelector:'.portfolio-item',
					layoutMode:'fitRows'
				});

				var $items = jQuery('.portfolio-items').isotope();

				//Filter items on button click
				jQuery('.portfolio-filters').on('click', 'span', function() {
					var filter = jQuery(this).data('filter');
					$items.isotope({filter:filter});
				});

				jQuery('.portfolio-filters').on('click', 'span', function() {
					jQuery(this).addClass("active").siblings().removeClass('active');
				});
			});
			
			var closeProject = function() {
				jQuery('#portfolio-details').animate({opacity:0}, {duration:600, queue:false, complete:function() {
					jQuery(this).hide().html('').removeAttr('data-current');
				}});
			};
			
			//Portfolio details
			jQuery('.portfolio-item a').on("click", function(e) {
				e.preventDefault();
				var $that = jQuery(this);
				var $item = $that.closest(".portfolio-item");
				
				if ($item.find('.loading').length===0) {
					jQuery('<div />').addClass('loading').appendTo($item);
					$that.parent().addClass('active');
	
					var $loading = $item.find('.loading'),
						$container = jQuery('#portfolio-details'),
						timer = 1;
	
					if ($container.is(':visible')) {
						closeProject();
						timer = 800;
						$loading.animate({width:'70%'}, {duration:2000, queue:false});
					}
	
					setTimeout(function() {
						$loading.stop(true, false).animate({width:'70%'}, {duration:6000, queue:false});
						
						//Add AJAX query to the url
						var url = $that.attr("href")+"?ajax=1";
						
						jQuery.get(url).done(function(response) {
							$container.html(response);
							
							$container.waitForImages(function() {
								$loading.stop(true, false).animate({width:'100%'}, {duration:500, queue:true});
								
								$loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
									$that.parent().removeClass('active');
									jQuery(this).remove();
	
									$container.show().css({opacity:0});	
									
									that.imageSlider($container, function() {
										jQuery(document).scrollTo($container, 600, {offset:{top:-parseInt(jQuery(".navbar").height(), 10), left:0}});
										$container.animate({opacity:1}, {duration:600, queue:false});
										$container.attr('data-current', $that.data("rel"));
									});
								}});
							});
						}).fail(function() {
							$that.parent().removeClass('active');
							$loading.remove();
						});
					}, timer);
				}
				
				e.preventDefault();
			});
	
			jQuery(document.body).on('click', '#portfolio-details .icon.close i', function() {
				closeProject();
			});
	
			//Anchor Links for Projects
			var dh = document.location.hash;
	
			if (/#view-/i.test(dh)) {
				var $item = jQuery('[rel="'+dh.substr(6)+'"]');
				
				if ($item.length>0) {
					jQuery(document).scrollTo('#portfolio', 0, {offset:{top:0, left:0}});
					jQuery(window).on('sena.complete', function() {
						$item.trigger('click');
					});
				}
			}
	
			jQuery('a[href^="#view-"]').on("click", function() {
				var $item = jQuery('[rel="'+jQuery(this).attr('href').substr(6)+'"]');
				
				if ($item.length>0) {
					jQuery(document).scrollTo('#portfolio', Sena_Options.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger('click');
					}});
				}
			});
		},
	
		//Parallax Sections
		parallax:function() {
			if (jQuery('.parallax').length===0) {
				return;
			}
	
			jQuery(window).on('load', function() {
				jQuery('.parallax').each(function() {
					if (jQuery(this).attr('data-image')) {
						jQuery(this).parallax('50%', 0.5);
						jQuery(this).css({backgroundImage:'url('+jQuery(this).data('image')+')'});
					}
				});
			});
		},
	
		//Video Background for Sections
		videos:function() {
			if (this.isTouch()) {
				jQuery('section.video').remove();
				return;
			}
	
			if (jQuery('section.video').length>0) {
				var tag = document.createElement('script');
				tag.src = "//www.youtube.com/player_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
				jQuery(window).on('resize', function() {
					jQuery('section.video').each(function() {
						jQuery(this).css({height:jQuery(this).find('.video-container .container').outerHeight(true)});
					});
				}).resize();
			}
		},
	
		//Google Maps
		map:function() {
			if (jQuery('#google-map').length===0) {
				return;
			}
			
			var that = this;
	
			jQuery(window).on('load', function() {
				that.mapCreate();
			});
		},
		
		//Create map
		mapCreate:function() {
			var $map = jQuery('#google-map');
			
			//Main color			
			var main_color = Sena_Options.mapColor==='' ? $map.data('color') : Sena_Options.mapColor;
			Sena_Options.mapColor = '';
			
			//Map marker
			var map_marker = Sena_Options.mapMarker==='' ? $map.data('marker') : Sena_Options.mapMarker;
			Sena_Options.mapMarker = '';

			//Saturation and brightness
			var saturation_value = -20;
			var brightness_value = 5;

			//Map style
			var style = [ 
				{//Set saturation for the labels on the map
					elementType:"labels",
					stylers:[
						{saturation:saturation_value},
					]
				}, 

				{//Poi stands for point of interest - don't show these labels on the map 
					featureType:"poi",
					elementType:"labels",
					stylers:[
						{visibility:"off"},
					]
				},

				{//Hide highways labels on the map
					featureType:'road.highway',
					elementType:'labels',
					stylers:[
						{visibility:"off"},
					]
				}, 

				{//Hide local road labels on the map
					featureType:"road.local", 
					elementType:"labels.icon", 
					stylers:[
						{visibility:"off"}, 
					] 
				},

				{//Hide arterial road labels on the map
					featureType:"road.arterial", 
					elementType:"labels.icon", 
					stylers:[
						{visibility:"off"},
					] 
				},

				{//Hide road labels on the map
					featureType:"road",
					elementType:"geometry.stroke",
					stylers:[
						{visibility:"off"},
					]
				},

				{//Style different elements on the map
					featureType:"transit", 
					elementType:"geometry.fill", 
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				}, 

				{
					featureType:"poi",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"poi.government",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"poi.attraction",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"poi.business",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"transit",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"transit.station",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"landscape",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]	
				},

				{
					featureType:"road",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"road.highway",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"water",
					elementType:"geometry",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				}
			];
			
			var coordY = $map.data('latitude'), coordX = $map.data('longitude');
			var latlng = new google.maps.LatLng(coordY, coordX);
			
			var settings = {
				zoom:$map.data('zoom'),
				center:new google.maps.LatLng(coordY, coordX),
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				panControl:false,
				zoomControl:false,
				mapTypeControl:false,
				streetViewControl:false,
				scrollwheel:false,
				draggable:true,
				mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU},
				navigationControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL},
				styles:style
			};
			
			var map = new google.maps.Map($map.get(0), settings);
			
			google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});
			
			var contentString = $map.parent().find('#map-info').html() || '';
			var infoWindow = new google.maps.InfoWindow({content: contentString});
			var companyPos = new google.maps.LatLng(coordY, coordX);
			
			var marker = new google.maps.Marker({
				position:companyPos,
				map:map,
				icon:map_marker,
				zIndex:3
			});
	
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(map, marker);
			});
			
			//Add custom buttons for the zoom-in/zoom-out on the map
			if (Sena_Options.zoomControlDiv===null) {				
				var zoomControlDiv = document.createElement('div');		
				var zoomControl = new customZoomControl(zoomControlDiv, map);
				Sena_Options.zoomControlDiv = zoomControlDiv;
			}

			//Insert the zoom div on the top left of the map
			map.controls[google.maps.ControlPosition.LEFT_TOP].push(Sena_Options.zoomControlDiv);
		},
		
		//Content slider
		contentSlider:function($root, element) {
			if (typeof $root==='undefined') {$root = jQuery('body');}
			if (typeof element==='undefined') {element = 'div';}
	
			$root.find('.content-slider').each(function() {
				var $that = jQuery(this), timeout, delay = false, process = false, $arrows;
				
				$that.css({position:'relative'}).find('> '+element).each(function(index) {
					$that.height(jQuery(this).outerHeight(true));
					jQuery(this).attr('data-index', index);
					jQuery(this).css({position:'relative', left:0, top:0});
					
					if (index>0) {
						jQuery(this).hide();
					} else {
						$that.attr('data-index', 0);
					}
				});
	
				if ($that.attr('data-arrows')) {
					$arrows = jQuery($that.attr('data-arrows'));
				} else {
					$arrows = $that.parent();
				}
	
				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
				
				if ($that.find('> '+element+'[data-index]').length<2) {
					$arrows.hide();
					clearInterval(timeout);
					delay = false;
				}
	
				$arrows.find('.arrow').on("click", function() {
					if (!process) {
						process = true;
						clearInterval(timeout);
	
						var index = parseInt($that.attr('data-index'), 10), last = parseInt($that.find('> '+element +':last-child').attr('data-index'), 10), set;
						var property;
						
						if (jQuery(this).hasClass('left')) {
							set = index===0 ? last : index-1;
							property = [ {left:100}, {left:-100}];
						} else {
							set = index===last ? 0 : index+1;
							property = [{left:-100}, {left:100}];
						}
						
						var $current = $that.find('> '+element+'[data-index='+index+']'),
							$next = $that.find('> '+element+'[data-index='+set+']');
	
						$that.attr('data-index', set);
						$current.css({left:'auto', right:'auto'});
						$current.animate({opacity:0}, {duration:300, queue:false});
	
						$current.animate(property[0], {duration:300, queue:false, complete:function() {
							jQuery(this).hide().css({opacity:1}).css({left:0});
	
							$that.animate({height:$next.outerHeight(true) }, {duration:(($that.outerHeight(true)===$next.outerHeight(true)) ? 0 : 200), queue:false, complete:function() {
								$next.css({opacity:0, left:'auto', right:'auto'}).css(property[1]).show();
								$next.animate({opacity:1}, {duration:300, queue:false});
	
								$next.animate({left:0}, {duration:300, queue:false, complete:function() {
									if (delay!==false) {
										timeout=setInterval(function() {
											$arrows.find('.arrow.right').click();
										}, delay);
									}
									process = false;
								}});
							}});
						}});
					}
				});
	
				jQuery(window).on('resize', function() {
					$that.each(function() {
						jQuery(this).height(jQuery(this).find('> '+element+':visible').outerHeight(true));
					});
				}).resize();
			});
		},
	
		//Contact form
		contact:function() {
			if (jQuery('#contact').length===0) {
				return;
			}
	
			var $name = jQuery('.field-name'), 
				$email = jQuery('.field-email'), 
				$phone = jQuery('.field-phone'),
				$text = jQuery('.field-message'), 
				$button = jQuery('#contact-submit'),
				$action = jQuery('.field-action');
	
			jQuery('.field-name, .field-email, .field-message').focus(function() {
				if (jQuery(this).parent().find('.error').length>0) {
					jQuery(this).parent().find('.error').fadeOut(150, function() {
						jQuery(this).remove();
					});
				}
			});
	
			$button.removeAttr('disabled');
			
			$button.on("click", function() {
				var fieldNotice = function($that) {
					if ($that.parent().find('.error').length===0) {
						jQuery('<span class="error"><i class="fas fa-times"></i></span>').appendTo($that.parent()).fadeIn(150);
					}
				};
	
				if ($name.val().length<1) {fieldNotice($name);}
				if ($email.val().length<1) {fieldNotice($email);}
				if ($text.val().length<1) {fieldNotice($text);}
	
				if (jQuery('#contact').find('.field .error').length===0) {
					jQuery(document).ajaxStart(function() {
						$button.attr('disabled', true);
					});
					
					jQuery.post($action.data('url'), {
						action:'contact',
						security:Sena.security,
						name:$name.val(), 
						email:$email.val(),
						phone:$phone.val(), 
						message:$text.val()
					}, function(response) {
						var data = jQuery.parseJSON(response);
						
						if (data.status==='email') {
							fieldNotice($email);
							$button.removeAttr('disabled');
						} else if (data.status==='error') {
							$button.text('Unknown Error :(');
						} else {
							jQuery('.contact-form-holder').fadeOut(300);
							jQuery('.contact-form-result').fadeIn(300);
						}
					});
				}
			});
		},
	
		//Images Slider
		imageSlider:function($root, onComplete) {
			if (typeof $root==='undefined') {$root = jQuery('body');}
			
			if ($root.find('.image-slider').length===0) {
				if (onComplete && typeof onComplete==='function') {onComplete();}
				return;
			}
			
			//Replace block gallery
			$root.find('.image-slider').each(function() {
				var $that = jQuery(this);				
				var $grid = $that.find('.blocks-gallery-grid');
				
				$that.html($grid.html());
				$grid.remove();
				
				var $list = $that.find('li');
				
				$list.each(function() {
					var $item = jQuery(this);
					var $img = $item.find('img');
					$img.removeClass().addClass('img-responsive img-rounded');
					$img.removeAttr('data-id').removeAttr('srcset').removeAttr('sizes').removeAttr('alt');
					$img.appendTo($item);

					var $figure = $item.find('figure');
					$figure.remove();
				});
				
				var $arrows = 	'<div class="arrows">'+
									'<a class="arrow left">'+
										'<i class="fas fa-chevron-left"></i>'+
									'</a>'+
									'<a class="arrow right">'+
										'<i class="fas fa-chevron-right"></i>'+
									'</a>'+
								'</div>';
				
				$that.append($arrows);
				$arrows = $that.find('.arrows');
				
				$that.wrap('<div class="image-slider" />').contents().unwrap();
				$list.wrap('<div />').contents().unwrap();	
			});
	
			$root.find('.image-slider').each(function() {
				var $that = jQuery(this),
					$arrows = $that.find('.arrows'),
					$list = jQuery(this).find('> div').not('.arrows'),
					timeout, 
					delay = false,
					process = false;
	
				var setHeight = function($that, onComplete) {
					$that.css({
						height:$that.find('> div:visible img').outerHeight(true)
					});
					
					if (onComplete && typeof onComplete==='function') {onComplete();}
				};
	
				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
	
				jQuery(this).waitForImages(function() {
					jQuery(this).css({position:'relative'});
	
					$list.hide().css({
						position:'absolute',
						top:0,
						left:0,
						zIndex:1,
						width:'100%',
						paddingLeft:15,
						paddingRight:15,
					});
	
					$list.eq(0).show();
	
					setHeight($that, onComplete);
					
					jQuery(window).on('resize', function() {
						setTimeout(function() {
							setHeight($that);
						}, 1);
					});
	
					if ($list.length===1) {
						$arrows.hide();
						clearInterval(timeout);
						delay = false;
					}
				});
	
				$arrows.find('.arrow').on('click', function(e) {
					if (process) {
						e.preventDefault();
						return;
					}
					
					clearInterval(timeout);
					
					var isRight = jQuery(this).hasClass('right');
					var $current = $that.find('> div:visible').not('.arrows'), $next;
	
					if (isRight) {						
						$next = $current.next();						
						if (!$next || $next.is('.arrows')) {
							$next = $list.eq(0);
						}
					} else {
						if ($current.is(':first-child')) {
							$next = $list.last();
						} else {
							$next = $current.prev();
						}
					}
	
					process = true;
					$current.css({zIndex:1});
					
					$next.css({opacity:0, zIndex:2}).show().animate({opacity:1}, {duration:300, queue:false, complete:function() {
						$current.hide().css({opacity:1});
						
						if (delay!==false) {
							timeout = setInterval(function() {
								$arrows.find('.arrow.right').click();
							}, delay);
						}
						
						process = false;
					}});
				});
			});
		},
	
		//Blog
		blog:function() {			
			//Search form
			jQuery(window).on('resize', function() {
				var width = parseInt(jQuery(".search-form .btn").outerWidth(), 10);
				jQuery(".search-form .search-field").css("padding-right", (width+16)+"px");
			}).resize();
			
			//Masonry blog
			if (jQuery('.blog-masonry').length) {
				//Get column width
				var getColumnWidth = function() {
					var $that = jQuery('.blog-masonry'),
						w = $that.outerWidth(true)-30,
						ww = jQuery(window).width(),
						columns;

					if ($that.hasClass('blog-masonry-four')) {
						columns = 4;
					} else if ($that.hasClass('blog-masonry-three')) {
						columns = 3;
					} else if ($that.hasClass('blog-masonry-two')) {
						columns = 2;
					} else {
						columns = 1;
					}

					if (ww<=767) {
						columns = 1;
					} else if (ww>=768 && ww<=991 && columns>2) {
						columns -= 1;
					}

					return Math.floor(w/columns);
				};

				jQuery('.blog-post.masonry').css({width:getColumnWidth()});

				jQuery('.blog-masonry').waitForImages(function() {
					jQuery(this).isotope({
						itemSelector:'.blog-post.masonry',
						resizable:false,
						transformsEnabled:false,
						masonry:{columnWidth:getColumnWidth()}
					});
				});

				jQuery(window).on('resize', function() {
					var size = getColumnWidth();
					jQuery('.blog-post.masonry').css({width:size});
					jQuery('.blog-masonry').isotope({
						masonry:{columnWidth:size}
					});
				});
			}
		},
        
        //Shop
        shop:function() {
            //Single product image slider
            if (jQuery('#product-slider-nav').length>0) {
                jQuery('#product-slider-nav').slick({
                    asNavFor:'#product-slider',
                    arrows:false,
                    dots:false,
                    infinite:true,
                    touchMove:false,                    
                    vertical:true,
                    verticalSwiping:true,
                    slidesToShow:3,
                    focusOnSelect:true,
                    responsive:[{
                        breakpoint:767,
                        settings:{
                            vertical:false,
                            slidesToShow:3
                        }
                    }]
                });
                
                jQuery('#product-slider').slick({
                    asNavFor:'#product-slider-nav',
                    arrows:false,
                    dots:false,
                    swipeToSlide:true                    
                });
            }
        },
		
		//Error page
		errorPage:function() {
			if (jQuery('#error-page').length>0) {
				jQuery(window).on('resize', function() {
					jQuery('#error-page').css({marginTop:-Math.ceil(jQuery('#error-page').outerHeight()/2)});
				}).resize();
			}
		},
		
		//Short codes
		shortCodes:function() {
			//Progress bars
			if (jQuery('.progress .progress-bar').length>0) {
				setTimeout(function() {
					jQuery(window).on('sena.complete', function() {
						jQuery(window).scroll(function() {
							var scrollTop = jQuery(window).scrollTop();
							
							jQuery('.progress .progress-bar').each(function() {
								var $that = jQuery(this), 
									itemTop = $that.offset().top-jQuery(window).height()+$that.height()/2;
								
								if (scrollTop>itemTop && $that.outerWidth()===0) {
									var percent = parseInt(jQuery(this).attr('data-value'), 10)+'%';
									var $value = jQuery(this).parent().parent().find('.progress-value');
									
									if ($value.length>0) {
										$value.css({width:percent, opacity:0}).html('<span>'+percent+'</span>');
									}
	
									$that.animate({width:percent}, {duration:1500, queue:false, complete:function() {
										if ($value.length>0) {
											$value.animate({opacity:1}, {duration:300, queue:false});
										}
									}});
								}
							});
						}).scroll();
					});
				}, 1);
			}
			
			//Counters
            if (jQuery('.number-count').length>0) {
                jQuery('.number-count').each(function() {
                    jQuery(this).counterUp({
                        delay:4,
                        time:1000
                    });
                });                
			}
			
			//Clients
			if (jQuery('.clients-slider').length>0) {
				jQuery('.clients-slider').owlCarousel({
                    autoplay:3000,
                    autoplaySpeed:300,
                    responsive:{
                        0:{
                            items:3
                        },
                        768:{
                            items:5
                        }
                    }
                });
			}
			
			//Testimonials
            if (jQuery('.testimonial-carousel').length>0) {
				jQuery(".testimonial-slider").append(jQuery(".single-block-text"));
				jQuery(".testimonial-nav").append(jQuery(".single-block-media"));
				
				jQuery(".testimonial-slider").slick({
					slidesToShow:1,
					slidesToScroll:1,
					arrows:false,
                    fade:true,
					asNavFor:".testimonial-nav"
				});

				jQuery(".testimonial-nav").slick({
					slidesToShow:5,
					slidesToScroll:1,
					asNavFor:".testimonial-slider",
                    arrows:false,
					centerMode:true,
					focusOnSelect:true,
					variableWidth:false,
                    responsive:[
						{
							breakpoint:991,
							settings:{
								slidesToShow:3,
                                arrows:false
							}
						},
						{
							breakpoint:480,
							settings:{
								slidesToShow:1,
                                arrows:false
							}
						}
					]
				});
			}
		},
		
		//Replace
		replace:function() {
			//Comment submit button
			var comment_btn = jQuery(".comment-form .submit");
			var comment_txt = comment_btn.val();
			comment_btn.replaceWith('<button id="submit" name="submit" class="submit btn btn-default" type="submit">'+comment_txt+'</button>');		
		
			//Search form
			var search_btn = jQuery(".widget_search").find("input.search-submit");
			search_btn.replaceWith('<button class="search-submit" type="submit"><i class="fas fa-search"></i></button>');
			
			//Mailchimp form
			var mailchimp_btn = jQuery("footer .mc4wp-form").find("input[type=submit]");
			mailchimp_btn.replaceWith('<button class="mailchimp-submit" type="submit"><i class="fas fa-long-arrow-alt-right"></i></button>');
			
			//Instagram
			jQuery(".instagram-feed li").each(function() {
				var width = jQuery(this)[0].getBoundingClientRect().width;
				jQuery(this).css('height', width+'px');
			});
			
			//Social widget
			jQuery(".widget_social").prev(".widget_text").addClass("mb-0");
			
			//Categories
			jQuery(".widget_categories .cat-item").each(function() {
				var item = jQuery(this);
				var txt = item.html();
			
				txt = txt.replace("(", "<span>");
				txt = txt.replace(")", "</span>");

				item.html(txt);
			});
			
		},
		
		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = 'width='+w+', height='+h+', resizable=1';
			
			//Title
			if (typeof title==='undefined') {
				title = jQuery('title').text();
			} else if (typeof title==='string') {
				if (title.indexOf("#")!=-1 && jQuery(title).length>0) {
					title = jQuery(title).text();
				}
			}
			
			title = title.trim();
			
			//Image
			if (typeof image==='undefined') {
				image = '';
			} else if (typeof image==='string') {
				if (!/http/i.test(image)) {
					if (jQuery(image).length>0) {
						if (jQuery(image).is('img')) {
							image = jQuery(image).attr('src');
						} else {
							image = jQuery(image).find('img').eq(0).attr('src');
						}
					} else {
						image = '';
					}
				}
			}
			
			//Url
			if (typeof url==='undefined') {
				url = document.location.href;
			} else {
				if (url.startsWith("#")) {
					url = document.location.protocol+'//'+document.location.host+document.location.pathname+url;
				}
			}
			
			//Share
			if (network==='twitter') {
				return window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+encodeURIComponent(url), 'share', params);
			} else if (network==='facebook') {
				return window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[url]='+encodeURIComponent(url)+'&p[title]='+encodeURIComponent(title)+'&p[images][0]='+encodeURIComponent(image), 'share', params);
			} else if (network==='pinterest') {
				return window.open('https://pinterest.com/pin/create/bookmarklet/?media='+image+'&description='+title+' '+encodeURIComponent(url), 'share', params);
			} else if (network==='linkedin') {
				return window.open('https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(url)+'&title='+title, 'share', params);
			}
			
			return;
		}
	};
	
	//Initialize
	$.Sena_Theme.init();

})(jQuery);

//Map zoom controls
function customZoomControl(controlDiv, map) {
	//Grap the zoom elements from the DOM and insert them in the map 
	var controlUIzoomIn = document.getElementById('zoom-in'),
	controlUIzoomOut = document.getElementById('zoom-out');

	controlDiv.appendChild(controlUIzoomIn);
	controlDiv.appendChild(controlUIzoomOut);

	//Setup the click event listeners and zoom-in or out according to the clicked element
	google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
		map.setZoom(map.getZoom()+1);
	});

	google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
		map.setZoom(map.getZoom()-1);
	});
}

//Share Functions
function shareTo(network, title, image, url) {
	return jQuery.Sena_Theme.share(network, title, image, url);
}

//Video Background for Sections
function onYouTubePlayerAPIReady() {
	jQuery('section.video').each(function(index) {				
		var $that = jQuery(this), 
			currentId = 'video-background-'+index;	
		
		jQuery('<div class="video-responsive"><div id="'+currentId+'"></div></div>').prependTo($that);

		var player = new YT.Player(currentId, {
			height:'100%',
			width:'100%',			
			playerVars:{
				'rel':0,
				'autoplay':1,
				'loop':1,
				'controls':0,
				'start':parseInt($that.attr('data-start'), 10),
				'autohide':1,
				'wmode':'opaque',
				'playlist':currentId
			},
			videoId:$that.attr('data-source'),
			events:{
				'onReady':function(evt) {
					evt.target.mute();
				},
				'onStateChange':function(evt) {
					if (evt.data===0) {evt.target.playVideo();}
				}
			}
		});

		var $control = $that.find('.video-control'),
			$selector = $that.find($control.attr('data-hide')),
			$container = $that.find('.video-container'),
			videoMode = $that.attr('data-video-mode')==='true' ? true : false;

		if ($control.length>0 && $selector.length>0) {
			$control.on("click", function() {
				if (!videoMode) {
					$that.attr('data-video-mode', 'true');
					videoMode = true;

					$that.find('.video-overlay').animate({opacity:0}, {duration:500, queue:false, complete:function() {
						jQuery(this).hide();
					}});
					
					$selector.animate({opacity:0}, {duration:500, queue:false, complete:function() {
						player.unMute();

						jQuery('<div />').appendTo($container).css({
							position:'absolute',
							textAlign:'center',
							bottom:'30px',
							color:'#fff',
							left:0,
							right:0,
							opacity:0
						}).addClass('click-to-exit');
						
						jQuery('<h5 />').appendTo($that.find('.click-to-exit')).text('Click to exit full screen');

						setTimeout( function() {
							$that.find('.click-to-exit').animate({opacity:1}, {duration:500, queue:false, complete:function() {
								setTimeout(function( ) {
									$that.find('.click-to-exit').animate({opacity:0}, {duration:500, queue:false, complete:function() {
										$(this).remove();
									}});
								}, 1500);
							}});
						}, 500);

						$selector.hide();
					}});
				}
			});

			$that.on("click", function(evt) {
				if (videoMode && (jQuery(evt.target).is('.video-container') || jQuery(evt.target).parent().is('.click-to-exit'))) {
					$selector.show().animate({opacity:1}, {duration:500, queue:false});
					$that.find('.video-overlay').show().animate({opacity:1}, {duration:500, queue:false});

					$that.find('.click-to-exit').remove();
					$that.removeAttr('data-video-mode');
					videoMode = false;

					player.mute();
				}
			});
		}
	});
}


