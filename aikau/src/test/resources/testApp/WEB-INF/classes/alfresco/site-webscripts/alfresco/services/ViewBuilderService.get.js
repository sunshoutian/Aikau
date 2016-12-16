var addPropButton = {
   id: "ADD_PROPERTY_BUTTON",
   name: "alfresco/buttons/AlfButton",
   config: {
      label: "Add Property",
      publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
      publishGlobal: true,
      publishPayload: {
         dialogId: "VIEW_BUILDER_ADD_PROPERTY_DIALOG",
         dialogTitle: "Add Property to View",
         formSubmissionTopic: "ALF_VIEW_BUILDER_ADD_VIEW_PROP",
         formSubmissionGlobal: true,
         formSubmissionPayloadMixin: {
            viewId: "TEST"
         },
         widgets: [
            {
               id: "PROP_NAME",
               name: "alfresco/forms/controls/TextBox",
               config: {
                  name: "propName",
                  label: "Property",
                  value: "",
                  requirementConfig: {
                     initialValue: true
                  }
               }
            },
            {
               id: "PROP_LABEL",
               name: "alfresco/forms/controls/TextBox",
               config: {
                  name: "propLabel",
                  label: "Label",
                  value: "",
                  requirementConfig: {
                     initialValue: true
                  }
               }
            }
         ]
      }
   }
};

var viewPropList = {
   name: "alfresco/lists/AlfList",
   config: {
      waitForPageWidgets: false,
      loadDataPublishTopic: "ALF_VIEW_BUILDER_GET_VIEW_PROPS",
      loadDataPublishPayload: {
         viewId: "TEST"
      },
      itemsProperty: "properties",
      noDataMessage: "No properties have been added to the view!",
      widgets: [
         {
            name: "alfresco/lists/views/AlfListView",
            config: {
               additionalCssClasses: "bordered",
               noItemsMessage: "No properties have been added to the view!",
               widgetsForHeader: [
                  {
                     name: "alfresco/lists/views/layouts/HeaderCell",
                     config: {
                        label: "",
                        sortable: false
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/HeaderCell",
                     config: {
                        label: "Label",
                        sortable: false
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/HeaderCell",
                     config: {
                        label: "Name",
                        sortable: false
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/HeaderCell",
                     config: {
                        label: "",
                        sortable: false
                     }
                  }
               ],
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 additionalCssClasses: "mediumpad",
                                 width: "50px",
                                 widgets: [
                                    {
                                       id: "PROPERTY_REORDER",
                                       name: "alfresco/renderers/Reorder",
                                       config: {
                                          propertyToRender: "propName",
                                          moveUpPublishTopic: "ALF_VIEW_BUILDER_MOVE_PROP",
                                          moveUpPublishPayloadItemMixin: true,
                                          moveUpPublishPayload: {
                                             direction: "UP",
                                             viewId: "TEST"
                                          },
                                          moveUpPublishGlobal: true,
                                          moveDownPublishTopic: "ALF_VIEW_BUILDER_MOVE_PROP",
                                          moveDownPublishPayloadItemMixin: true,
                                          moveDownPublishPayload: {
                                             direction: "DOWN",
                                             viewId: "TEST"
                                          },
                                          moveDownPublishGlobal: true
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 additionalCssClasses: "mediumpad",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "propLabel"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 additionalCssClasses: "mediumpad",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "propName"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 additionalCssClasses: "mediumpad",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          iconClass: "delete-16",
                                          propertyToRender: "propName",
                                          publishTopic: "ALF_VIEW_BUILDER_DELETE_VIEW_PROP",
                                          publishPayloadItemMixin: true,
                                          publishPayload: {
                                             requiresConfirmation: true,
                                             viewId: "TEST"
                                          },
                                          publishGlobal: true
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   }
};

var addViewButton = {
   id: "CREATE_VIEW_BUTTON",
   name: "alfresco/buttons/AlfButton",
   config: {
      label: "Add View",
      publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
      publishPayload: {
         dialogId: "ADD_VIEW_DIALOG",
         dialogTitle: "Add View",
         formSubmissionTopic: "ALF_CRUD_CREATE",
         formSubmissionGlobal: true,
         formSubmissionPayloadMixin: {
            url: "aikau/view"
         },
         widgets: [
            {
               id: "VIEW_NAME",
               name: "alfresco/forms/controls/TextBox",
               config: {
                  name: "name",
                  label: "Name",
                  description: "This is the name to give the view",
                  value: "",
                  requirementConfig: {
                     initialValue: true
                  }
               }
            },
            {
               id: "VIEW_PROPS",
               name: "alfresco/forms/controls/List",
               config: {
                  name: "view",
                  label: "View Properties",
                  description: "This is an ordered list of all the properties to display in the view",
                  widgetsBeforeList: [ addPropButton ],
                  widgetsForList: [ viewPropList ]
               }
            }
         ]
      }
   }
};


model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/CrudService",
      "alfresco/services/DialogService",
      "alfresco/services/ViewBuilderService"
   ],
   widgets:[
      addViewButton,
      {
         name: "alfresco/lists/AlfList",
         config: {
            pubSubScope: "VIEWS_",
            loadDataPublishTopic: "ALF_CRUD_GET_ALL",
            loadDataPublishPayload: {
               url: "aikau/views"
            },
            itemsProperty: "items",
            noDataMessage: "No views have been created",
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "name"
                                             }
                                          }
                                       ]
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/ViewBuilderMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};