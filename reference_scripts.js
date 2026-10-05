
// ================= SCRIPT 1 ================

                        window._actualCartItems = [
                                                    { item_id: '231', item_name: 'ব্ল্যাক মেহেদী - ১০০ গ্রাম', price: 699, quantity: 1, image: 'https://veshojbdnt.com/public/uploads/product/prd6ab378fb2eda53.40062326.webp' },
                                                ];
                    
// ================= SCRIPT 2 ================

    // owl carousels
    $(document).ready(function () {
        $('.campro_img_slider').owlCarousel({
            dots:false, autoplay:true, loop:true, margin:14, smartSpeed:900,
            responsive:{0:{items:1},480:{items:2},768:{items:3},1170:{items:4}}
        });
        $('.review_slider').owlCarousel({
            dots:false, autoplay:true, loop:true, margin:14, smartSpeed:900,
            responsive:{0:{items:1},480:{items:2},768:{items:3},1170:{items:3}}
        });
        $('.owl-nav').remove();
    });

// ================= SCRIPT 3 ================

    // shipping area change
    $("#area").on("change", function () {
        var id = $(this).val();
        $.ajax({
            type: "GET", data: { id: id }, url: "https://veshojbdnt.com/shipping-charge", dataType: "html",
            success: function (response) { $('.cartlist').html(response); vbSyncQtyInputs(); }
        });
    });

// ================= SCRIPT 4 ================

    // select2 for area
    $(document).ready(function () { if ($.fn.select2) { $('#area').select2({ minimumResultsForSearch: 10 }); } });

// ================= SCRIPT 5 ================

    // ===== Before/After slider =====
    (function () {
        var range = document.getElementById('vb2baRange');
        if (!range) return;
        var after = document.getElementById('vb2baAfter');
        var bar   = document.getElementById('vb2baBar');
        var box   = document.getElementById('vb2ba');
        function setPos(v) { after.style.clipPath = 'inset(0 0 0 ' + v + '%)'; bar.style.left = v + '%'; }
        range.addEventListener('input', function () { setPos(this.value); });
        function dragTo(clientX) {
            var r = box.getBoundingClientRect();
            var v = Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100));
            range.value = v; setPos(v);
        }
        var dragging = false;
        box.addEventListener('mousedown', function (e) { dragging = true; dragTo(e.clientX); });
        window.addEventListener('mousemove', function (e) { if (dragging) dragTo(e.clientX); });
        window.addEventListener('mouseup', function () { dragging = false; });
        box.addEventListener('touchstart', function (e) { dragTo(e.touches[0].clientX); }, { passive: true });
        box.addEventListener('touchmove', function (e) { dragTo(e.touches[0].clientX); }, { passive: true });
        setPos(50);
    })();

// ================= SCRIPT 6 ================

    // ===== Countdown timer (HH:MM:SS) =====
    (function () {
        var el = document.getElementById('vb2timer'); if (!el) return;
                var end = new Date("2026-10-05 11:28:00").getTime();
                function tick() {
            var d = end - new Date().getTime();
            if (d <= 0) { el.textContent = '00:00:00'; return; }
            var h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000);
            el.textContent = ('0'+h).slice(-2)+':'+('0'+m).slice(-2)+':'+('0'+s).slice(-2);
        }
        tick(); setInterval(tick, 1000);
    })();

// ================= SCRIPT 7 ================

    // ===== Scroll to top =====
    (function () {
        var btn = document.getElementById('vb2top'); if (!btn) return;
        window.addEventListener('scroll', function () { btn.classList.toggle('show', window.scrollY > 500); });
        btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    })();

// ================= SCRIPT 8 ================

    // ===== Social proof toast (rotating) =====
    (function () {
        var toast = document.getElementById('vb2toast'); if (!toast) return;
        var nameEl = document.getElementById('vb2toastName'), timeEl = document.getElementById('vb2toastTime');
        var people = [
            ['সুমি, চট্টগ্রাম','১ মিনিট আগে'],['রাহাত, ঢাকা','২ মিনিট আগে'],
            ['নুসরাত, খুলনা','৪ মিনিট আগে'],['ইমরান, সিলেট','৬ মিনিট আগে'],
            ['মিম, রাজশাহী','৮ মিনিট আগে'],['তানভীর, বরিশাল','১১ মিনিট আগে']
        ];
        var i = 0;
        function show() {
            nameEl.textContent = people[i][0];
            timeEl.textContent = people[i][1] + ' — এইমাত্র অর্ডার করেছেন';
            toast.classList.add('show');
            setTimeout(function () { toast.classList.remove('show'); }, 4500);
            i = (i + 1) % people.length;
        }
        setTimeout(function () { show(); setInterval(show, 12000); }, 4000);
    })();

// ================= SCRIPT 9 ================

    // ===== Cart variant (size / color) selectors =====
    $(document).on('change', '.cart-size-selector', function () {
        var rowId = $(this).data('id'); var sizeId = $(this).val();
        if (!rowId) return;
        $.ajax({ type:"GET", data:{ id:rowId, size_id:sizeId }, url:"https://veshojbdnt.com/cart/update",
            success:function (data) { if (data) { $(".cartlist").html(data); vbSyncQtyInputs(); } } });
    });
    $(document).on('change', '.cart-color-selector', function () {
        var rowId = $(this).data('id'); var colorId = $(this).val();
        if (!rowId) return;
        $.ajax({ type:"GET", data:{ id:rowId, color_id:colorId }, url:"https://veshojbdnt.com/cart/update",
            success:function (data) { if (data) { $(".cartlist").html(data); vbSyncQtyInputs(); } } });
    });

// ================= SCRIPT 10 ================

$(document).ready(function () {
    var incompleteOrderTimer = null;
    var isSubmitting = false;

    $('form[action="https://veshojbdnt.com/customer/order-save"]').on('submit', function () { isSubmitting = true; });

    $('input[name="name"], input[name="phone"], input[name="address"]').on('input change', function () {
        saveIncompleteOrder();
    });

    function saveIncompleteOrder() {
        if (isSubmitting) return;
        if (incompleteOrderTimer) clearTimeout(incompleteOrderTimer);

        incompleteOrderTimer = setTimeout(function () {
            var name    = $('input[name="name"]').val();
            var phone   = $('input[name="phone"]').val();
            var address = $('input[name="address"]').val();
            if (!name || !phone || !address) return;

            var total = parseFloat($('#net_total strong').text().replace(/[^0-9.]/g, '')) || 0;
            var actualItems = window._actualCartItems || [];
            var cartItems = actualItems.map(function (item) {
                return { id: item.item_id, name: item.item_name, qty: item.quantity, price: item.price, image: item.image };
            });

            $.ajax({
                url: 'https://veshojbdnt.com/checkout/incomplete-order',
                type: 'POST',
                contentType: 'application/json',
                headers: { 'X-CSRF-TOKEN': $('input[name="_token"]').val() },
                data: JSON.stringify({ name:name, phone:phone, address:address, items:cartItems, total_amount:total }),
                success: function () { console.log('Campaign Incomplete Order Saved'); },
                error: function (err) { console.error('Failed to save Campaign Incomplete Order', err); }
            });
        }, 2000);
    }
});
