// count expired
var category = ['Services','Goods&Equipments','Others'];

$.each(category,function(x,y){
    $.post(apiurl+'/countexpiredequipment',{param:1,category:y},function(items){
        $('#param1cat'+x).text(items.data.length);
    },'json');
})
$.each(category,function(x,y){
    $.post(apiurl+'/countexpiredequipment',{param:2,category:y},function(items){
        $('#param2cat'+x).text(items.data.length);
    },'json');
})
$.each(category,function(x,y){
    $.post(apiurl+'/countexpiredequipment',{param:3,category:y},function(items){
        $('#param3cat'+x).text(items.data.length);
    },'json');
})

$('.btn-detail-1').click(function(){
    detailsite(1);
    $('#param-title').text('Last Month');
})
$('.btn-detail-2').click(function(){
    detailsite(2);
    $('#param-title').text('This Month');
})
$('.btn-detail-3').click(function(){
    detailsite(3);
    $('#param-title').text('Next Month');
})

//SITE Detail
function detailsite(vparam){
    
    
    
    $.post(apiurl+'/expiredsite',{param:vparam},function(items){
        let drillDownDataSource = {};
        
        $('#grid-detailequipment').dxPivotGrid({
            height: 440,
            rowHeaderLayout: 'tree',
            showBorders: true,

            onCellClick: function(e) {
                if(e.area == "data") {
                    const pivotGridDataSource = e.component.getDataSource();
                    const rowPathLength = e.cell.rowPath.length;
                    const rowPathName = e.cell.rowPath[rowPathLength - 1];
                    const popupTitle = `${rowPathName || 'Total'} : Drill Down Data`;

                    drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
                    salesPopup.option('title', popupTitle);
                    salesPopup.show();

                }
            },
            export: {
                enabled: true,
                fileName: "DxExport"
            },
            fieldChooser: {
                enabled: true,
                height: 400
            },
            onCellPrepared: function(e) {
                if(typeof e.cell.rowPath !== 'undefined') {
                    e.cellElement.css('color','blue');
                }
            },
            dataSource: {
                fields: [{
                    caption: 'site',
                    dataField: 'site',
                    area: 'row',
                    expanded: true,
                }, 
                {
                    dataField: 'category',
                    dataType: 'category',
                    area: 'column',
                }, {
                    caption: 'jumlah',
                    dataField: 'jml',
                    dataType: 'number',
                    area: 'data',
                    summaryType: 'sum',
                }],
            store: items,
            },
        });

        const salesPopup = $('#site-popup').dxPopup({
            width: 1200,
            height: 700,
            contentTemplate(contentElement) {
              $('<div />')
                .addClass('drill-down')
                .dxDataGrid({
                  width: 1150,
                  height: 620,
                  scrolling: {
                    mode: "virtual"
                  },
                  allowColumnReordering: true,
                    allowColumnResizing: true,
                    columnsAutoWidth: true,
                    columnMinWidth: 130,
                    columnHidingEnabled: false,
                    wordWrapEnabled: true,
                    showBorders: true,
                    rowAlternationEnabled: true,
                    filterRow: { visible: true },
                    // filterPanel: { visible: true },
                    headerFilter: { visible: true },
                    pager: {
                        visible: true,
                        showInfo: true,
                    },
                  columns: [
                        'site',
                        'subcontractor',
                        'unit_no',
                        'type',
                        'description',
                        'hire_type',
                        'period_start',
                        'period_end',
                        'currency',
                        { 
                            dataField: "amount",
                            caption: "amount",
                            dataType: "number",
                            format: "fixedPoint",
                            editorOptions: {
                                format: "fixedPoint"
                            }
                        },
                        'uom',
                        'remarks',
                        'status',
                        'no_kap',
                        'category',
                    ],
                  export : {
                    enabled: true,
                    fileName: 'Detail Data'
                  },
                })
                .appendTo(contentElement);
            },
            onShowing() {
              $('.drill-down')
                .dxDataGrid('instance')
                .option('dataSource', drillDownDataSource);
            },
            onShown() {
              $('.drill-down')
                .dxDataGrid('instance')
                .updateDimensions();
            },
          }).dxPopup('instance');

    })  


    

}

