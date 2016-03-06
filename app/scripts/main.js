/*globals $:false, Vue:false, moment:false */
'use strict';
var vm = new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    itemOffset: 0,
    items: [],
    filteredItems: [],
    selectedItem: {}
  },
  methods: {
    chunk: function(array, size) {
      var copied = array.concat();
      var chunked = [];

      while (copied.length > 0) {
        chunked.push(copied.splice(0, size));
      }
      return chunked;
    },
    filterByQuery: function() {
      this.itemOffset = 0;
      var q = this.searchQuery;
      if (q === '') {
        this.filteredItems = [];
        return;
      } else {
        this.filteredItems = this.items.filter(function(item) {
          if (item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
            return true;
          }
          if (item.tags && item.tags.join('|').toLowerCase().indexOf(q.toLowerCase()) !== -1) {
            return true;
          }
        });
      }
    },
    showModal: function(item) {
      this.selectedItem = item;
      $('.modal').modal();
    },
    getItemAtRandom: function() {
      return this.items[Math.floor(Math.random() * this.items.length)];
    }
  },
  computed: {
    resultLengthWithCommas: function() {
      return this.filteredItems.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    hasMore: function() {
      return this.filteredItems.length > (this.itemOffset + 1) * 10;
    }
  },
  created: function() {
    $.getJSON('jsons/items.json', function(dt) {
      dt.forEach(function(item) {
        var parsedDate = moment(item.date);
        var ymd = '';
        if (parsedDate.year() < 2000) {
          ymd = parsedDate.format('YYMMDD');
        } else {
          ymd = parsedDate.format('YYYYMMDD');
        }
        var ym = ymd.substr(0, ymd.length - 2);
        item.thumbURL = 'http://www.ibiblio.org/Dave/Dr-Fun/inline/thumbs/tn' + ymd + '.jpg';
        item.imageURL = 'http://www.ibiblio.org/Dave/Dr-Fun/df' + ym + '/df' + ymd + '.jpg';
      });
      vm.$set('items', dt);
    });
  }
});
