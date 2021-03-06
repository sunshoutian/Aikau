/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * 
 * @module alfresco/lists/views/layouts/HeaderCell
 * @extends module:aikau/core/BaseWidget
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/core/topics",
        "alfresco/util/hashUtils",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/query",
        "dojo/dom-attr"], 
        function(declare, BaseWidget, topics, hashUtils, lang, domClass, query, domAttr) {

   return declare([BaseWidget], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/HeaderCell.properties"}]
       * @since 1.0.77
       */
      i18nRequirements: [{i18nFile: "./i18n/HeaderCell.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/HeaderCell.css"}]
       */
      cssRequirements: [{cssFile:"./css/HeaderCell.css"}],

      /**
       * Optional accessibility scope.
       *
       * @instance
       * @type {string}
       * @default
       */
      a11yScope: null,

      /**
       * Indicates whether or not this header can actually be used to trigger sort requests.
       * 
       * @instance
       * @type boolean
       * @default
       */
      sortable: false,

      /**
       * Optional alt text for the sort ascending icon. An optional {0} token can be provided to
       * insert the [label]{@link module:alfresco/lists/views/layouts/HeaderCell#label}
       *
       * @instance
       * @type {string}
       * @default
       */
      sortAscAlt: null,

      /**
       * Optional alt text for the sort descending icon. An optional {0} token can be provided to
       * insert the [label]{@link module:alfresco/lists/views/layouts/HeaderCell#label}.
       *
       * @instance
       * @type {string}
       * @default
       */
      sortDescAlt: null,

      /**
       * Indicates whether or not the column headed by this cell is sorted in ascending order or not.
       * This value is only relevant when the [usedForSort]{@link module:alfresco/lists/views/layouts/HeaderCell#usedForSort}
       * attribute is true.
       * 
       * @instance
       * @type boolean
       * @default
       */
      sortedAscending: false,

      /**
       * The value to publish to sort on.
       *
       * @instance
       * @type {string}
       * @default
       */
      sortValue: null,

      /**
       * The tool tip to display.
       *
       * @instance
       * @type {string}
       * @default
       */
      toolTipMsg: null,

      /**
       * A transparent image to use (this will allow the background image to show through).
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.77
       */
      transparentImageUrl: null,

      /**
       * Indicate whether or not this cell is currently being used as the sort field.
       *
       * @instance
       * @type boolean
       * @default
       */
      usedForSort: false,

      /**
       * Indicates whether or not the current browser URL hash should be used to determine whether or not
       * the header is currently marked as being sorted.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.56
       */
      useHash: false,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_lists_views_layouts_Row__createWidgetDom() {
         this.containerNode = this.domNode = document.createElement("th");
         this.domNode.classList.add("alfresco-lists-views-layouts-HeaderCell");
         this.domNode.setAttribute("tabindex", "0");
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onSortClick));

         this.labelNode = document.createElement("span");
         this.labelNode.classList.add("label");
         this.labelNode.textContent = this.label;
         this.domNode.appendChild(this.labelNode);

         this.ascendingSortNode = document.createElement("img");
         this.ascendingSortNode.classList.add("ascendingSort");
         this.ascendingSortNode.setAttribute("src", this.transparentImageUrl);
         this.domNode.appendChild(this.ascendingSortNode);

         this.descendingSortNode = document.createElement("img");
         this.descendingSortNode.classList.add("descendingSort");
         this.descendingSortNode.setAttribute("src", this.transparentImageUrl);
         this.domNode.appendChild(this.descendingSortNode);
      },

      /**
       * @instance
       */
      postMixInProperties: function alfresco_lists_views_layouts_HeaderCell__postMixInProperties() {
         if (this.label !== null)
         {
            this.label = this.message(this.label);
         }
         this.currentItem = {};
         this.transparentImageUrl = require.toUrl("alfresco/menus/css/images/transparent-20.png");

         // Set up the alt text for the sort icons...
         if (!this.sortAscAlt)
         {
            this.sortAscAlt = this.label ? "header.cell.sort.ascending.alt.text" : "header.cell.sort.ascending.alt.text.nolabel";
         }
         if (!this.sortDescAlt)
         {
            this.sortDescAlt = this.label ? "header.cell.sort.descending.alt.text" : "header.cell.sort.descending.alt.text.nolabel";  
         }
         this.sortAscAlt = this.message(this.sortAscAlt, {"0": this.label});
         this.sortDescAlt = this.message(this.sortDescAlt, {"0": this.label});
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       * @listens module:alfresco/core/topics#SORT_LIST
       * @listens module:alfresco/core/topics#UPDATE_LIST_SORT_FIELD
       */
      postCreate: function alfresco_lists_views_layouts_HeaderCell__postCreate() {
         if (this.useHash && this.sortable)
         {
            var currHash = hashUtils.getHash();
            if (currHash.sortField === this.sortValue)
            {
               this.usedForSort = true;
               this.sortedAscending = currHash.sortAscending === "true";
            }
         }

         this.alfSubscribe(topics.SORT_LIST, lang.hitch(this, this.onExternalSortRequest));
         this.alfSubscribe(topics.UPDATE_LIST_SORT_FIELD, lang.hitch(this, this.onExternalSortRequest));

         domAttr.set(this.ascendingSortNode, "alt", this.sortAscAlt ? this.sortAscAlt : "");
         domAttr.set(this.descendingSortNode, "alt", this.sortDescAlt ? this.sortDescAlt : "");

         if (this.sortable === false || this.usedForSort === false)
         {
            this.sortIcon("nil");
         }
         else
         {
            this.sortIcon(this.sortedAscending === false ? "desc" : "asc");
         }

         if(this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }

         if(this.a11yScope)
         {
            this.addA11yScope(this.a11yScope);
         }
      },

      /**
       * Focuses the domNode. This has been added to support the dijit/_KeyNavContainer functions mixed into 
       * the [document library views]{@link module:alfresco/lists/views/AlfListView} to 
       * allow easier keyboard navigation.
       * 
       * @instance
       */
      focus: function alfresco_lists_views_layouts_HeaderCell__focus() {
         this.domNode.focus();
      },

      /**
       * This function is called whenever the header cell is clicked. It publishes a request to 
       * resort the current data and updates its display
       *
       * @instance
       * @param {object} evt The click event
       */
      onSortClick: function alfresco_lists_views_layouts_HeaderCell__onSortClick(/*jshint unused:false*/ evt) {
         if (this.sortable === true)
         {
            this.alfLog("log", "Sort request received");

            // If currently NOT being used for sort then we start with ascending
            if (this.usedForSort === false)
            {
               this.usedForSort = true;
               this.sortedAscending = true;
               this.sortIcon("asc");
            }

            // If we are already sorting on this column and direction is ascending then we want descending
            else if (this.sortedAscending === true)
            {
               this.sortIcon("desc");
               this.sortedAscending = false;
            }

            // Otherwise we want sort by ascending
            else
            {
               this.sortIcon("asc");
               this.sortedAscending = true;
            }
            this.publishSortRequest();
         }
      },

      /**
       * @instance
       * @fires module:alfresco/core/topics#SORT_LIST
       */
      publishSortRequest: function alfresco_lists_views_layouts_HeaderCell__publishSortRequest() {
         this.alfPublish(topics.SORT_LIST, {
            direction: (this.sortedAscending) ? "ascending" : "descending",
            value: this.sortValue,
            requester: this,
            label: this.label
         });
      },

      /**
       * This handles external sort requests so that the header cell can match the current 
       * status.
       *
       * @instance
       * @param {object} payload
       */
      onExternalSortRequest: function alfresco_lists_views_layouts_HeaderCell__onExternalSortRequest(payload) {
         var requester = lang.getObject("requester", false, payload);
         if (requester !== this)
         {
            var value = lang.getObject("value", false, payload);
            if (value !== null)
            {
               if (value === this.sortValue)
               {
                  this.usedForSort = true;
                  this.sortIcon(this.sortedAscending === true ? "asc" : "desc");
               }
               else
               {
                  // A different field has been used for sorting, hide the sort icons and update the status...
                  this.usedForSort = false;
                  this.sortIcon("nil");
               }
            }

            var direction = lang.getObject("direction", false, payload);
            if (direction !== null)
            {
               this.sortedAscending = direction === "ascending";
               if (this.usedForSort === true)
               {
                  this.sortIcon(this.sortedAscending === true ? "asc" : "desc");
               }
            }
         }
      },

      /**
       * This controls the display of icons when using sort functionality.
       *
       * @instance
       * @param {string} dir - asc, desc or nil
       */
      sortIcon: function alfresco_lists_views_layouts_HeaderCell__sortIcon(dir) {
         var hideClass = "hidden",
             asn = this.ascendingSortNode,
             dsn = this.descendingSortNode;

         switch(dir)
         {
            case "asc":
               domClass.remove(asn, hideClass);
               domClass.add(dsn, hideClass);
            break;

            case "desc":
               domClass.add(asn, hideClass);
               domClass.remove(dsn, hideClass);
            break;

            default:
               domClass.add(asn, hideClass);
               domClass.add(dsn, hideClass);
            break;
         }
      },

      /**
       * Adds a scope attribute to the header cell if provided.
       *
       * @instance
       */
      addA11yScope: function alfresco_lists_views_layouts_HeaderCell__addA11yScope(scopeStr) {
         if(scopeStr)
         {
            domAttr.set(this.containerNode, "scope", scopeStr);
         }
      }
   });
});