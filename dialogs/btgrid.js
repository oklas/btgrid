CKEDITOR.dialog.add( 'btgrid', function( editor ) {
  var lang = editor.lang.btgrid;
  var commonLang = editor.lang.common;

  // Whole-positive-integer validator.
  function validatorNum(msg) {
    return function() {
      var value = this.getValue(),
        pass = !!(CKEDITOR.dialog.validate.integer()(value) && value > 0);

      if (!pass) {
        alert(msg); // jshint ignore:line
      }

      return pass;
    };
  };

  function validatorWidth(msg) {
    return function() {
      var value = this.getValue(),
        pass = !!(CKEDITOR.dialog.validate.integer()(value) && value >= 0 && value < 12);

      if (!pass) {
        alert(msg); // jshint ignore:line
      }

      return pass;
    };
  };

  function createWidthField(id) {
    return (
      {
        id: 'colWidth' + id,
        type: 'text',
        width: '50px',
        required: true,
        label: lang.manualWidth + ' ' + id,
        validate: validatorWidth(lang.manualWidthError + ' ' + id),
        setup: function( widget ) {
          this.setValue( widget.data.colWidth + id );
        },
        commit: function( widget ) {
          widget.setData( 'colWidth' + id, this.getValue());
        }
      }
    )
  };

  return {
    title: lang.editBtGrid,
    minWidth: 600,
    minHeight: 300,
    onShow: function() {
      // Detect if there's a selected table.
      var selection = editor.getSelection(),
        ranges = selection.getRanges();
      var command = this.getName();

      var rowsInput = this.getContentElement('info', 'rowCount'),
        colsInput = this.getContentElement('info', 'colCount');
      if (command == 'btgrid') {
        var grid = selection.getSelectedElement();
        // Enable or disable row and cols.
        if (grid) {
          this.setupContent(grid);
          rowsInput && rowsInput.disable();
          colsInput && colsInput.disable();
        }
      }
    },
    contents: [
      {
        id: 'info',
        label: lang.infoTab,
        accessKey: 'I',
        elements: [
          {
            id: 'colCount',
            type: 'select',
            required: true,
            label: lang.selNumCols,
            items: [
              [ '2', 2],
              [ '3', 3],
              [ '4', 4],
              [ '6', 6],
              [ '12', 12],
              [ lang.manualCols, 1 ]
            ],
            validate: validatorNum(lang.numColsError),
            setup: function( widget ) {
              this.setValue(widget.data.colCount);
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function( widget ) {
              widget.setData( 'colCount', this.getValue());
            }
          },
          {
            id: 'rowCount',
            type: 'text',
            width: '50px',
            required: true,
            label: lang.genNrRows,
            validate: validatorNum(lang.numRowsError),
            setup: function( widget ) {
              this.setValue( widget.data.rowCount );
            },
            commit: function( widget ) {
              widget.setData( 'rowCount', this.getValue());
            }
          }
        ].concat([1,2,3,4,5,6,7,8,9,10,11,10].map(createWidthField))
      }
    ],
  };
});
