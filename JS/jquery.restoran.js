(function ($) {
    $.fn.restoran = function (options) {
        var defaults = {
            Column1Header: '№ заказа',
            Column2Header: 'Дата и время заказа',
            OrderDetailCaption: 'Описание заказа',
            PageHeader: 'Список заказов',
            DishCaption: 'Блюдо',
            QuantityCaption: 'Кол.',
            OrderDescription: 'Состав заказа',
            PriceCaption: 'Цена',
            WeightCaption: 'Вес',
            TotalCaption: 'Всего'
        };
        var o = $.extend({}, defaults, options);
        var body;
        //Загружаем заказы с сервера
        function loadOrders() {
            $.ajax({
                url: 'Service.svc/GetListOrders',
                success: function (orders) {
                    showOrders(orders.d);
                   //привязываем собятие нажатия строке
                    body.find('.row').on("click", function () {
                        openOrderDetail($(this).attr("OrderID"));
                    });
          
                },
                dataType: 'json',
                cache: false
            });
        }
        //Рисуем заказы
        function showOrders( orders) {
            $.each(orders, function(i, order) {
                var row = $('<div class="row">').appendTo(body);
                row.attr("OrderID", order.OrderID);
                $('<div class="col-md-2">').append(order.OrderName).appendTo(row);
                $('<div class="col-md-3">').append(order.OrderDate.convert().format("dd mm yyyy HH:MM:ss")).appendTo(row);
            });
            

        }
        //Если окно было ране создано, то нужно удалить все старое
        function removeOldDialog() {
            body.find('[aria-labelledby=myLargeModalLabel]').remove();
        }
        //Создаем окно с информацией о заказе
        function createDialog(order) {
            var dialog = $('<div>').
                addClass("modal fade").
                attr("tabindex","-1").
                attr("role","dialog").
                attr("aria-labelledby","myLargeModalLabel").
                attr("aria-hidden", "true").appendTo(body);
            
            var div = $('<div>').
                addClass("modal-dialog modal-lg").
                appendTo(dialog);

            var content = $('<div class="modal-content">').appendTo(div);
            var modalheader = $('<div class="modal-header">').appendTo(content);

            $('<button type="button">').
                addClass('close').
                attr("data-dismiss","modal").
                attr("aria-hidden","true").
                append("×").appendTo(modalheader);


            $('<h4 class="modal-title" id="myLargeModalLabel">' + o.OrderDetailCaption + '</h4>').appendTo(modalheader);
            var modalbody = $('<div class="modal-body">').appendTo(content);
            modalbody.height(400);
            var row = $('<div class=row">').appendTo(modalbody);

            createLeftPanel(row, order.d);
            createRightPanel(row, order.d);
            return dialog;
        }
       //Левая половина окна
        function createLeftPanel(modalbody, order) {
            var leftPanel = $('<div class="col-md-4">').appendTo(modalbody);
            $('<p>' + o.Column1Header + ':' + order.OrderName + '</p>').appendTo(leftPanel);
            $('<p>' + o.Column2Header + ':</p>').appendTo(leftPanel);
            $('<p>'+ order.OrderDate.convert().format("dd mm yyyy HH:MM:ss") + '</p>').appendTo(leftPanel);
            $('<p>' + o.TotalCaption+':'+ order.Total + '</p>').appendTo(leftPanel);


        }

        function createRightPanelHeader(parent) {
            
             $('<h2>' + o.OrderDescription + '</h2>').appendTo(parent);

            var headerGrid = $('<div class="grid-header">').appendTo(parent);
            $('<div class="col-md-4">').append(o.DishCaption).appendTo(headerGrid);
            $('<div class="col-md-2">').append(o.QuantityCaption).appendTo(headerGrid);
            $('<div class="col-md-2">').append(o.PriceCaption).appendTo(headerGrid);
            $('<div class="col-md-2">').append(o.WeightCaption).appendTo(headerGrid);
            $('<div class="col-md-2">').append(o.TotalCaption).appendTo(headerGrid);
        }
       //Рисуем блюда
        function showItems(rightPanel, items) {
            var rightPanelbody = $('<div class="container-fluid">').appendTo(rightPanel);
            rightPanel.css("overflow", "auto");
            rightPanelbody.height(400);
            $.each(items, function (i, item) {
                var row = $('<div class="row">').appendTo(rightPanelbody);
             
                $('<div class="col-md-4">').append(item.Name).appendTo(row);
                $('<div class="col-md-2">').css("text-align", "center").append(item.Quantity!=1?item.Quantity:"&nbsp;").appendTo(row);
                $('<div class="col-md-2">').css("text-align", "center").append(item.Quantity != 1 ? item.Price : "&nbsp;").appendTo(row);
                $('<div class="col-md-2">').css("text-align", "center").append(item.Weight).appendTo(row);
                $('<div class="col-md-2">').css("text-align", "center").append(item.Total).appendTo(row);
   
            });


        }
        function createRightPanel(modalbody, order) {
            var rightPanel = $('<div class="col-md-8">').appendTo(modalbody);
     

            createRightPanelHeader(rightPanel);
            showItems(rightPanel, order.Items);

        }
        //Запрашиваем информацию о заказе
        function openOrderDetail(orderID) {
            removeOldDialog();
        
           
            $.ajax({
                url: 'Service.svc/GetOrderDetail?orderID=' + orderID,
                success: function (order) {
                    var dialog = createDialog(order);
                    dialog.modal({});
                },
                dataType: 'json',
                cache: false
            });


           
        }

        function createHeader(parent) {
            var header = $('<div class="page-header">').appendTo(parent);
            header.append($('<h1>' + o.PageHeader + '</h1>'));
            var headerGrid = $('<div class="grid-header">').appendTo(parent);
            $('<div class="col-md-2">').append(o.Column1Header).appendTo(headerGrid);
            $('<div class="col-md-3">').append(o.Column2Header).appendTo(headerGrid);

        }

        function createBody(parent) {
            body = $('<div class="body container">').appendTo(parent);
        }
        return this.each(function () {
            var $$ = $(this);
            createHeader($$);
            createBody($$);
            loadOrders();

            //Если есть ошибки показываем информацию
            $(document).ajaxError(function (xhr, xhr1, xhr2) {
                if (xhr1.statusText != null)
                    alert(xhr1.statusText);
            });
        });
    };
})(jQuery);