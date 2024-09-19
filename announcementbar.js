//Set a timer automatically scroll the announcement bar
setInterval(function() {
    const total_announcement = "3"
    var total_announcement_left = $("#total_announcement_left").val();

    for (let i = 0; i <= total_announcement; i++) {
      const startDate = new Date();
      const endDateStr = $("#expired_at_" + i).val();
      const endDate = endDateStr == undefined ? new Date() : new Date(endDateStr.replace(/-/g, "/"));
      const seconds = (endDate.getTime() - startDate.getTime()) / 1000;

      const days = parseInt(seconds / 86400);
      const hours = parseInt((seconds % 86400) / 3600);
      const mins = parseInt((seconds % 86400 % 3600) / 60);
      const secs = parseInt((seconds % 86400 % 3600) % 60);

      // use to translate countdown unit
      // (translate based on the preferred language when save announcement bar setting)
      String.prototype.translate = function() {
        try {
          if ($("#locale").val() == "zh_TW") {
            if (this.toString() === 'day') {
              return "天";
            }
            if (this.toString() === 'hour') {
              return "小時";
            }
            if (this.toString() === 'min') {
              return "分鐘";
            }
            if (this.toString() === 'sec') {
              return "秒";
            }
          } else {
            if (this.toString() === 'day') {
              if (days > 0) {
                return "Days";
              } else {
                return "Day";
              }
            } else if (this.toString() === 'hour') {
              if (hours > 0) {
                return "Hours";
              } else {
                return "Hour";
              }
            } else if (this.toString() === 'min') {
              if (mins > 0) {
                return "Mins";
              } else {
                return "Min";
              }
            } else if (this.toString() === 'sec') {
              if (secs > 0) {
                return "Secs";
              } else {
                return "Sec";
              }
            }
          }
        } catch (error) {
          console.log("Some errors heres", error);
        }
      };
// In progress
      const announcementBar_countdown = document.getElementById("announcementBar_countdown_" + i);
      if (announcementBar_countdown && seconds > 0) {

        $(announcementBar_countdown).show()
        announcementBar_countdown.innerHTML = `
          <div>
            ${days} <small>${'day'.translate()}</small>
          </div>
          <div>
            ${hours} <small>${'hour'.translate()}</small>
          </div>
          <div>
            ${mins} <small>${'min'.translate()}</small>
          </div>
          <div>
            ${secs} <small>${'sec'.translate()}</small>
          </div>
        `;


      } else if (announcementBar_countdown && seconds <= 0) {
        $("#announcement_bar_" + i).remove();
        total_announcement_left = total_announcement_left - 1;
        $("#total_announcement_left").val(total_announcement_left);
      }
    }

    showOrHide(total_announcement_left);
  }, 1000);


  function showOrHide(total_announcement_left) {
    if (total_announcement_left <= 1) {
      $("#previous-announcement-bar-button,#next-announcement-bar-button").hide();
    } else {
      $("#previous-announcement-bar-button,#next-announcement-bar-button").show();
    }

    if (total_announcement_left == 0) {
      $("#announcement-close-button").hide();
      $("#announcement-bar").hide();
      $('#announcement-bar-top').hide();
    }
  };

  let annoucementBarAutoMoveInterval = '';
  class AnnouncementBarAppSlider extends HTMLElement {
    constructor() {
      super();
      this.slider = this.querySelector('ul');
      this.sliderItems = this.querySelectorAll('li');
      this.prevButton = this.querySelector('a[name="previous"]');
      this.nextButton = this.querySelector('a[name="next"]');

      if (!this.slider || !this.nextButton) return;

      const resizeObserver = new ResizeObserver(entries => this.initPages());
      resizeObserver.observe(this.slider);

      this.slider.addEventListener('scroll', this.update.bind(this));
      this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton.addEventListener('click', this.onButtonClick.bind(this));


    }

    initPages() {
      const sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
      this.sliderLastItem = sliderItemsToShow[sliderItemsToShow.length - 1];
      if (sliderItemsToShow.length === 0) return;
      this.slidesPerPage = Math.floor(this.slider.clientWidth / sliderItemsToShow[0].clientWidth);
      this.totalPages = sliderItemsToShow.length - this.slidesPerPage + 1;
      this.update();
      let self = this
      var total_announcement_left = $("#total_announcement_left").val();
      annoucementBarAutoMoveInterval = setInterval(function() {
        if (total_announcement_left > 1) {
          self.moveSlide('next')
        }
      }, 5000)
    }

    update() {
      this.currentPage = Math.round(this.slider.scrollLeft / this.sliderLastItem.clientWidth) + 1;
    }

    onButtonClick(event) {
      event.preventDefault();
      let self = this;
      self.moveSlide(event.currentTarget.name);
    }


    moveSlide(move_to) {

      clearInterval(annoucementBarAutoMoveInterval);
      let self = this;
      annoucementBarAutoMoveInterval = setInterval(function() {
        self.moveSlide('next');
      }, 5000)

      if (move_to === 'previous' && this.currentPage === 1) {
        this.slider.scrollTo({
          left: this.sliderLastItem.clientWidth * (this.totalPages - 1)
        });
      } else if (move_to === 'next' && this.currentPage === this.totalPages) {
        this.slider.scrollTo({
          left: 0
        });
      } else {
        const slideScrollPosition = move_to === 'next' ? this.slider.scrollLeft + this.sliderLastItem
          .clientWidth : this.slider.scrollLeft - this.sliderLastItem.clientWidth;
        this.slider.scrollTo({
          left: slideScrollPosition
        });
      }
    }

  }

  customElements.define('slider-announcement-bar-app', AnnouncementBarAppSlider);