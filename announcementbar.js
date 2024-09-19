// Set a timer to automatically scroll the announcement bar
setInterval(function () {
  const total_announcement = 3; // Set the total number of announcements as a number
  var total_announcement_left = $("#total_announcement_left").val();

  // Loop through each announcement based on the total count
  for (let i = 0; i < total_announcement; i++) {
    const startDate = new Date(); // Current date and time
    const endDateStr = $("#expired_at_" + i).val(); // Get the expiration date string for each announcement
    const endDate = endDateStr === undefined ? new Date() : new Date(endDateStr.replace(/-/g, "/")); // Convert string to date format
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000; // Calculate time difference in seconds

    // Calculate days, hours, minutes, and seconds from the time difference
    const days = parseInt(seconds / 86400);
    const hours = parseInt((seconds % 86400) / 3600);
    const mins = parseInt((seconds % 3600) / 60);
    const secs = parseInt(seconds % 60);

    // Function to format time units in English
    function formatUnit(unit, value) {
      if (unit === 'day') {
        return value !== 1 ? "Days" : "Day";
      } else if (unit === 'hour') {
        return value !== 1 ? "Hours" : "Hour";
      } else if (unit === 'min') {
        return value !== 1 ? "Mins" : "Min";
      } else if (unit === 'sec') {
        return value !== 1 ? "Secs" : "Sec";
      }
    }

    // Example output using the formatUnit function
    console.log(
      `${days} ${formatUnit('day', days)}, ${hours} ${formatUnit('hour', hours)}, ${mins} ${formatUnit('min', mins)}, ${secs} ${formatUnit('sec', secs)}`
    );
  }
}, 1000); // Set interval time, e.g., 1000ms (1 second)
  
  // Function to show or hide announcement bar buttons based on the total announcements left
  function showOrHide(total_announcement_left) {
    if (total_announcement_left <= 1) {
      // Hide previous and next buttons if there's only one or no announcements left
      $("#previous-announcement-bar-button,#next-announcement-bar-button").hide();
    } else {
      // Show previous and next buttons if there are multiple announcements left
      $("#previous-announcement-bar-button,#next-announcement-bar-button").show();
    }

    // Hide the entire announcement bar if there are no announcements left
    if (total_announcement_left == 0) {
      $("#announcement-close-button").hide();
      $("#announcement-bar").hide();
      $('#announcement-bar-top').hide();
    }
  };

  let annoucementBarAutoMoveInterval = '';
  // Class to manage the announcement bar slider functionality
  class AnnouncementBarAppSlider extends HTMLElement {
    // Constructor initializes the slider and its buttons
    constructor() {
      super();
      this.slider = this.querySelector('ul'); // The main slider element
      this.sliderItems = this.querySelectorAll('li'); // The list items within the slider
      this.prevButton = this.querySelector('a[name="previous"]'); // The previous button
      this.nextButton = this.querySelector('a[name="next"]'); // The next button

      // If essential elements are missing, stop further execution
      if (!this.slider || !this.nextButton) return;

      // Observe slider size changes and initialize pages accordingly
      const resizeObserver = new ResizeObserver(entries => this.initPages());
      resizeObserver.observe(this.slider);

      // Set up event listeners for scrolling and button clicks
      this.slider.addEventListener('scroll', this.update.bind(this));
      this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton.addEventListener('click', this.onButtonClick.bind(this));


    }

    // Initialize the number of pages based on the slider's size and item width
    initPages() {
      const sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
      this.sliderLastItem = sliderItemsToShow[sliderItemsToShow.length - 1];
      if (sliderItemsToShow.length === 0) return;
      this.slidesPerPage = Math.floor(this.slider.clientWidth / sliderItemsToShow[0].clientWidth);
      this.totalPages = sliderItemsToShow.length - this.slidesPerPage + 1;
      this.update();

      // Set up automatic slide movement every 5 seconds if more than one announcement exists
      let self = this
      var total_announcement_left = $("#total_announcement_left").val();
      annoucementBarAutoMoveInterval = setInterval(function() {
        if (total_announcement_left > 1) {
          self.moveSlide('next')
        }
      }, 5000)
    }

    // Update the current page index based on scroll position
    update() {
      this.currentPage = Math.round(this.slider.scrollLeft / this.sliderLastItem.clientWidth) + 1;
    }

    // Handle button clicks to move slides
    onButtonClick(event) {
      event.preventDefault();
      let self = this;
      self.moveSlide(event.currentTarget.name);
    }

    // Function to move the slide based on direction ('next' or 'previous')
    moveSlide(move_to) {

      // Clear existing interval and set up a new one for automatic movement
      clearInterval(annoucementBarAutoMoveInterval);
      let self = this;
      annoucementBarAutoMoveInterval = setInterval(function() {
        self.moveSlide('next');
      }, 5000)

      // Scroll to the last page if at the start or the first page if at the end
      if (move_to === 'previous' && this.currentPage === 1) {
        this.slider.scrollTo({
          left: this.sliderLastItem.clientWidth * (this.totalPages - 1)
        });
      } else if (move_to === 'next' && this.currentPage === this.totalPages) {
        this.slider.scrollTo({
          left: 0
        });
      } else {
        // Move the slider left or right by the width of one slide
        const slideScrollPosition = move_to === 'next' ? this.slider.scrollLeft + this.sliderLastItem
          .clientWidth : this.slider.scrollLeft - this.sliderLastItem.clientWidth;
        this.slider.scrollTo({
          left: slideScrollPosition
        });
      }
    }

  }

  // Define the custom element for the announcement bar slider
  customElements.define('slider-announcement-bar-app', AnnouncementBarAppSlider);