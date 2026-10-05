// ============================================================
// ZERO ALLERGY LANDING PAGE — INTERACTIVE SCRIPTS
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // 1. PRODUCTS DATA
    const products = {
        'pack_1': {
            id: 'pack_1',
            name: 'জিরো এলার্জি - ১ বোতল (১ মাসের কোর্স)',
            shortName: 'জিরো এলার্জি - ১ বোতল',
            price: 750,
            regularPrice: 1150,
            image: 'images/IMG_7091.webp'
        },
        'pack_2': {
            id: 'pack_2',
            name: 'জিরো এলার্জি - ২ বোতল (কমপ্লিট কোর্স - ৩০০৳ অতিরিক্ত ছাড়)',
            shortName: 'জিরো এলার্জি - ২ বোতল',
            price: 1200,
            regularPrice: 1500,
            image: 'images/IMG_7091.webp'
        }
    };

    let selectedProductId = 'pack_1';
    let currentQty = 1;

    // Elements
    const productRows = document.querySelectorAll('.vb-product-row');
    const cartItemName = document.getElementById('cart_item_name');
    const cartItemImg = document.getElementById('cart_item_img');
    const cartItemPrice = document.getElementById('cart_item_price');
    const cartQtyInput = document.getElementById('cart_qty_input');
    const netTotal = document.getElementById('net_total_val');
    const grandTotal = document.getElementById('grand_total_val');
    const orderForm = document.getElementById('vb-order-form');

    // Function to update cart table
    function updateCartDisplay() {
        const prod = products[selectedProductId];
        if (!prod) return;

        if (cartItemName) cartItemName.textContent = prod.shortName;
        if (cartItemImg) cartItemImg.src = prod.image;
        if (cartQtyInput) cartQtyInput.value = currentQty;

        const totalAmount = prod.price * currentQty;
        if (cartItemPrice) cartItemPrice.textContent = '৳' + (prod.price * currentQty).toLocaleString();
        if (netTotal) netTotal.textContent = totalAmount.toLocaleString();
        if (grandTotal) grandTotal.textContent = totalAmount.toLocaleString();
    }

    // Function to select product
    window.selectProduct = function (prodId) {
        selectedProductId = prodId;
        currentQty = 1;

        productRows.forEach(row => {
            const radio = row.querySelector('.vb-product-radio');
            if (row.id === 'product_row_' + prodId) {
                row.classList.add('selected');
                if (radio) radio.checked = true;
            } else {
                row.classList.remove('selected');
                if (radio) radio.checked = false;
            }
        });

        updateCartDisplay();
    };

    // Quantity Increment / Decrement
    const btnMinus = document.querySelector('.cart_decrement');
    const btnPlus = document.querySelector('.cart_increment');

    if (btnMinus) {
        btnMinus.addEventListener('click', function () {
            if (currentQty > 1) {
                currentQty--;
                updateCartDisplay();
            }
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', function () {
            if (currentQty < 10) {
                currentQty++;
                updateCartDisplay();
            }
        });
    }

    // 2. BEFORE / AFTER SLIDER
    (function initBeforeAfter() {
        const range = document.getElementById('vb2baRange');
        const after = document.getElementById('vb2baAfter');
        const bar = document.getElementById('vb2baBar');
        const box = document.getElementById('vb2ba');

        if (!range || !after || !bar || !box) return;

        function setPos(v) {
            after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
            bar.style.left = v + '%';
        }

        range.addEventListener('input', function () {
            setPos(this.value);
        });

        function dragTo(clientX) {
            const r = box.getBoundingClientRect();
            const v = Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100));
            range.value = v;
            setPos(v);
        }

        let dragging = false;
        box.addEventListener('mousedown', function (e) {
            dragging = true;
            dragTo(e.clientX);
        });
        window.addEventListener('mousemove', function (e) {
            if (dragging) dragTo(e.clientX);
        });
        window.addEventListener('mouseup', function () {
            dragging = false;
        });

        box.addEventListener('touchstart', function (e) {
            dragTo(e.touches[0].clientX);
        }, { passive: true });
        box.addEventListener('touchmove', function (e) {
            dragTo(e.touches[0].clientX);
        }, { passive: true });

        setPos(50);
    })();

    // 3. COUNTDOWN TIMER (2 hours countdown)
    (function initTimer() {
        const timerEl = document.getElementById('vb2timer');
        if (!timerEl) return;

        let totalSeconds = 2 * 3600 - 15; // 1 hr 59 min 45 sec
        function tick() {
            if (totalSeconds <= 0) totalSeconds = 2 * 3600;
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            timerEl.textContent =
                ('0' + h).slice(-2) + ':' +
                ('0' + m).slice(-2) + ':' +
                ('0' + s).slice(-2);
            totalSeconds--;
        }
        tick();
        setInterval(tick, 1000);
    })();

    // 4. SCROLL TO TOP
    (function initScrollTop() {
        const topBtn = document.getElementById('vb2top');
        if (!topBtn) return;

        window.addEventListener('scroll', function () {
            topBtn.classList.toggle('show', window.scrollY > 400);
        });

        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    // 5. SOCIAL PROOF ROTATING TOAST
    (function initSocialToast() {
        const toast = document.getElementById('vb2toast');
        const nameEl = document.getElementById('vb2toastName');
        const timeEl = document.getElementById('vb2toastTime');
        if (!toast || !nameEl || !timeEl) return;

        const orders = [
            ['সুমি আক্তার, চট্টগ্রাম', '১ মিনিট আগে ২ বোতল অর্ডার করেছেন'],
            ['মোঃ রাহাত ইসলাম, ঢাকা', '২ মিনিট আগে ১ বোতল অর্ডার করেছেন'],
            ['কামরুল হাসান, সিলেট', '৩ মিনিট আগে ২ বোতল অর্ডার করেছেন'],
            ['নুসরাত জাহান, খুলনা', '৪ মিনিট আগে ১ বোতল অর্ডার করেছেন'],
            ['ইমরান হোসেন, রাজশাহী', '৬ মিনিট আগে ২ বোতল অর্ডার করেছেন'],
            ['তানভীর মাহমুদ, বরিশাল', '৮ মিনিট আগে ১ বোতল অর্ডার করেছেন'],
            ['আব্দুল মান্নান, কুমিল্লা', '১০ মিনিট আগে ২ বোতল অর্ডার করেছেন']
        ];

        let idx = 0;
        function showToast() {
            nameEl.textContent = orders[idx][0];
            timeEl.textContent = orders[idx][1];
            toast.classList.add('show');

            setTimeout(function () {
                toast.classList.remove('show');
            }, 4500);

            idx = (idx + 1) % orders.length;
        }

        setTimeout(function () {
            showToast();
            setInterval(showToast, 11000);
        }, 3000);
    })();

    // 6. ORDER SUBMISSION & CONFIRMATION MODAL
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const area = document.getElementById('area').value;

            if (!name || !phone || !address) {
                alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা দিন।');
                return;
            }

            if (phone.length < 11) {
                alert('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
                return;
            }

            const currentProd = products[selectedProductId];
            const total = currentProd.price * currentQty;

            const orderPayload = {
                name: name,
                phone: phone,
                address: address,
                area: area === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে',
                package_id: selectedProductId,
                package_name: currentProd.name,
                quantity: currentQty,
                unit_price: currentProd.price,
                total_price: total
            };

            // Send order to server (which logs locally and syncs with Supabase)
            fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            })
            .then(res => res.json())
            .then(data => console.log('Order submitted:', data))
            .catch(err => console.error('Order submit error:', err));

            // Show confirmation modal
            const modal = document.getElementById('orderSuccessModal');
            const modalSummary = document.getElementById('modalOrderSummary');

            if (modal && modalSummary) {
                modalSummary.innerHTML = `
                    <strong>পণ্য:</strong> ${currentProd.name}<br>
                    <strong>পরিমাণ:</strong> ${currentQty} টি<br>
                    <strong>মোট মূল্য:</strong> ৳${total.toLocaleString()}<br>
                    <strong>ডেলিভারি:</strong> ফ্রি ডেলিভারি (ক্যাশ অন ডেলিভারি)<br>
                    <strong>গ্রাহক:</strong> ${name} (${phone})<br>
                    <strong>ঠিকানা:</strong> ${address}
                `;
                modal.classList.add('active');
            } else {
                alert(`ধন্যবাদ ${name}!\nআপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।\nমোট মূল্য: ৳${total} (ক্যাশ অন ডেলিভারি)।\nআমরা শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করব।`);
            }
        });
    }

    // Modal close button
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            const modal = document.getElementById('orderSuccessModal');
            if (modal) modal.classList.remove('active');
            if (orderForm) orderForm.reset();
            window.selectProduct('pack_1');
        });
    }
});
