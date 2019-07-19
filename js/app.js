onYouTubeIframeAPIReady = function () {
	trailer.injectTrailer();
}

app = {
	//////////////////////////////////////////////
	// FIXED VARS
	//////////////////////////////////////////////
	pages: [
		// Default Data Nodes:
		// id: id of DOM <el>.page
		{
			id: 'page-landing', // must match dom id
		},
		{
			id: 'page-synopsis',
		},
		{
			id: 'page-cast',
		},
		{
			id: 'page-gallery',
		},
		{
			id: 'page-camera',
		},
	],

	//////////////////////////////////////////////
	// REUSEABLE VARS
	//////////////////////////////////////////////
	pageCurrent: 0, // track current page index

	//////////////////////////////////////////////
	// app.init();
	//////////////////////////////////////////////
	init: () => {

		app.bindEvents(); // Bind DOM Events


		if (Detectizr.device.type != 'desktop') {
			$('body').addClass('ani-goSite'); // Start animations
			app.pageOpen('page-landing'); // open first page
		}

	},

	//////////////////////////////////////////////
	// EVENT BINDINGS
	//////////////////////////////////////////////

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.bindEvents - DOM events
	//::::::::::::::::::::::::::::::::::::::::::::
	bindEvents: () => {

		$('.btn[data-btn_goto]').click((e) => {
			let $this = $(e.currentTarget);
			app.pageGo($this.data('btn_goto'));
		});

		$('.btn[data-btn_ytplay]').click((e) => {
			let $this = $(e.currentTarget);
			trailer.show($this.data('btn_ytplay'))
		});

		$('#trailerClose').click((e) => {
			trailer.hide();
		})
	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.bindPageClosed - Page HAS closed events
	//::::::::::::::::::::::::::::::::::::::::::::
	bindPageClosed: (page) => {
		console.log("bindPageClosed: " + page.id);

		// Global Page events




		// Specific page events
		switch (page.id) {
			case "page-landing":
				break;
			case "page-synopsis":
				break;
			case "page-cast":
				break;
			case "page-gallery":
				break;
			case "page-camera":
				break;
		}

	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.bindPageOpening - Page WILL open events
	//::::::::::::::::::::::::::::::::::::::::::::
	bindPageOpening: (page) => {
		console.log("bindPageOpening: " + page.id);

		// Specific page events
		switch (page.id) {
			case "page-landing":
				break;
			case "page-synopsis":
				break;
			case "page-cast":
				break;
			case "page-gallery":
				if (!app.gallery) {
					app.galleryMake();
				}
				break;
			case "page-camera":
				break;
		}

	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.bindPageReady - Page HAS opened events
	//::::::::::::::::::::::::::::::::::::::::::::
	bindPageReady: (page) => {
		console.log("bindPageReady: " + page.id)

		// Global Page events

		// Specific page events
		switch (page.id) {
			case "page-landing":
				break;
			case "page-synopsis":
				break;
			case "page-cast":
				break;
			case "page-gallery":
				break;
			case "page-camera":
				break;
		}

	},

	//////////////////////////////////////////////
	// PAGING FUNCTIONS
	//////////////////////////////////////////////

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.pageOpen([pageId:string]) - Opena page
	//::::::::::::::::::::::::::::::::::::::::::::
	pageOpen(pageId) {

		$('.page').addClass('is-dnone'); // Remove all un used pages from DOMs

		console.log('pageOpen: ' + pageId);

		const page = app.pageFind(pageId); // get the page object

		if (!page) { // check page exists
			console.error(pageId + ' Not found to open');
			return; // fail!
		}

		const $page = $('#' + page.id);

		$page.removeClass('is-dnone');

		setTimeout(() => { // SetTimeOut fixes bug with display none removal stopping css animations happening

			// HTML PAGES
			app.bindPageOpening(page)

			$page.addClass('is-current');
			$page.find('.screen').addClass('ani-goScreen');

			// check for transitions
			let transitionEvent = app.cssTransitionEvent();
			let $transObject = $page;

			if ($page.find('.ani-lastIn').length > 0) {

				$transObject = $page.find('.ani-lastIn');
				$transObject = $($transObject[0]);
			}

			// After transition End
			$transObject.one(transitionEvent, function () {
				console.log('pageOpen Transition Complete');
				$page.addClass('is-ready');
				app.bindPageReady(page);
			}); //

			// VIDEO PAGES
			if (page.videoId) {
				app.pageVid($('#' + page.videoId));
				return;
			}
		}, 1); // End timeout fix
	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.pageClose([pageId:string, nextId:string]) - Close a page (optional open another page after wards)
	//::::::::::::::::::::::::::::::::::::::::::::
	pageClose(pageId, nextId) {
		console.log('pageClose: ' + pageId);

		const page = app.pageFind(pageId); // get the page object

		if (!page) {
			console.error(pageId + ' Not found to close');
			return;
		}

		$('#' + page.id).removeClass('is-current is-ready');

		let transitionEvent = app.cssTransitionEvent();
		$('#' + pageId).one(transitionEvent, function () {

			app.bindPageClosed(page);
			app.pageNavChecks(); // update site nav elements

			if (nextId) {
				app.pageOpen(nextId);
			}

		});
	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.pageFind([pageId:string]) - Find page object in array from ID
	//::::::::::::::::::::::::::::::::::::::::::::
	pageFind: (pageId) => {
		for (let i = 0; i < app.pages.length; i++) {
			if (app.pages[i].id == pageId) {
				return app.pages[i]; // return after finding first match
			}

		}
		return false;
	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.pageFindIndex([pageId:string]) - Find page object Index in array from ID
	//::::::::::::::::::::::::::::::::::::::::::::
	pageFindIndex: (pageId) => {
		for (let i = 0; i < app.pages.length; i++) {
			if (app.pages[i].id == pageId) {
				return i; // return after finding first match
			}

		}
		return false;
	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.pageGo([pageId:string]) - Close current page and go to named page
	//::::::::::::::::::::::::::::::::::::::::::::
	pageGo: (pageId) => {
		console.log("pageGo to: " + pageId);

		const currentPage = app.pages[app.pageCurrent].id;
		app.pageCurrent = app.pageFindIndex(pageId);
		app.pageClose(currentPage, pageId)
	},

	//::::::::::::::::::::::::::::::::::::::::::::
	// app.pageNavCheck - Update available page navigation objects
	//::::::::::::::::::::::::::::::::::::::::::::
	pageNavChecks: () => {
		$('.screen--scroll').scrollTop(0); // rest all scrolls
	},

	//////////////////////////////////////////////
	//! GALLERY FUNCTIONS
	//////////////////////////////////////////////

	//::::::::::::::::::::::::::::::::::::::::::::
	//! app.galleryMake() - create gallery
	//::::::::::::::::::::::::::::::::::::::::::::
	galleryMake: () => {

		app.gallery = $('#slick-gallery').slick({
			appendArrows: null,
			prevArrow: $('#btn-galPrev'),
			nextArrow: $('#btn-galNext')

		});

	},
	//////////////////////////////////////////////
	// UTILITY FUNCTIONS
	//////////////////////////////////////////////
	//::::::::::::::::::::::::::::::::::::::::::::
	// app.cssTransitionEvent - Event detection for CSS Transitions
	//::::::::::::::::::::::::::::::::::::::::::::
	cssTransitionEvent: () => {
		// https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/

		var t,
			el = document.createElement("fakeelement");

		var transitions = {
			"transition": "transitionend",
			"OTransition": "oTransitionEnd",
			"MozTransition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	},

	//////////////////////////////////////////////
} // END APP /////////////////////////////////
//////////////////////////////////////////////

//////////////////////////////////////////////
//! TRAILER
//////////////////////////////////////////////


var trailer = {
	injected: false,
	SETTINGS: {
		VIDEO_ID: 'vEJaRuD5u-4'
	},
	isPlaying: false,

	closeBtn: document.getElementById("trailerClose"),
	modal: document.getElementById('trailer'),

	insertScript: function () {

		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		trailer.bindEvents();

	},

	bindEvents: function () {

		trailer.closeBtn.addEventListener('click', trailer.hide);


	},

	bindFullScreen: function () {

		if (Detectizr.device.type == 'desktop') return;

		document.addEventListener("fullscreenchange", trailer.changeHandler, false);
		document.addEventListener("webkitfullscreenchange", trailer.changeHandler, false);
		document.addEventListener("mozfullscreenchange", trailer.changeHandler, false);

	},

	changeHandler: function (event) {

		if (!document.webkitFullscreenElement) {

			trailer.hide();

		}

	},

	injectTrailer: function () {

		trailer.injected = true;
		trailer.player = new YT.Player('yt-trailer', {

			height: '100%',
			width: '100%',
			videoId: trailer.SETTINGS.VIDEO_ID,
			wmode: 'transparent',
			host: 'https://www.youtube-nocookie.com',
			playerVars: {
				wmode: 'transparent',
				showinfo: 0,
				modestbranding: true,
				rel: 0,
				mute: 0
			},
			events: {
				'onReady': trailer.onPlayerReady.bind(null, true),
				'onStateChange': trailer.onPlayerStateChange
			}

		});
	},

	onPlayerReady: function (event, first) {

		trailer.iframe = document.getElementById("trailer");
		console.log('ready')
		trailer.bindFullScreen();

	},

	animate_play: function (event) {

		$('#trailer').removeClass('is-dnone');

		setTimeout(() => {
			trailer.modal.classList.add('is-open');
		}, 300)

		trailer.player.playVideo();

	},

	onPlayerStateChange: function (event) {

		if (event.data == 0) {

			trailer.hide();

		}

	},

	stopVideo: function () {
		if (trailer.player)
			trailer.player.stopVideo();

	},

	show: function (id) {

		if (!trailer.injected) trailer.injectTrailer();
		else {
			if (id != trailer.player.getVideoData()['video_id']) trailer.switchId(id);
			trailer.animate_play();
		}

		trailer.watched = true;
	},

	hide: function () {
		console.log('hide Trailer')
		trailer.modal.classList.remove('is-open');

		setTimeout(() => {
			trailer.stopVideo();
			trailer.modal.classList.add('is-dnone');
		}, 300)

	},

	switchId: function (videoId) {

		trailer.player.loadVideoById(videoId);

	}
}

//////////////////////////////////////////////
// DOC READY
//////////////////////////////////////////////
$(document).ready(() => {
	trailer.insertScript(); // Start the YT Trailer
	app.init();
})