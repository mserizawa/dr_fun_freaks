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
      }
      var isTagSearch = q.indexOf('tag:') === 0;
      this.filteredItems = this.items.filter(function(item) {
        if (!isTagSearch) {
          if (item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
            return true;
          }
          if (item.tags && item.tags.join('|').toLowerCase().indexOf(q.toLowerCase()) !== -1) {
            return true;
          }
        } else {
          return item.tags && item.tags.indexOf(q.substr(4)) !== -1;
        }
        return false;
      });
    },
    showModal: function(item) {
      this.selectedItem = item;
      $('.modal').modal();
    },
    getItemAtRandom: function() {
      return this.items[Math.floor(Math.random() * this.items.length)];
    },
    searchByTag: function(tag) {
      this.searchQuery = 'tag:' + tag;
      this.filterByQuery();
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
        var ymd = parsedDate.format('YYYYMMDD');
        item.thumbURL = 'https://s3-ap-northeast-1.amazonaws.com/drfun/thumb_' + ymd + '.jpg';
        item.imageURL = 'https://s3-ap-northeast-1.amazonaws.com/drfun/' + ymd + '.jpg';
        item.fullYMD = ymd;
      });
      vm.$set('items', dt);
    });
  }
});
