/**
 * Lumière Restaurant - Main Interactive Script
 * Modern Vanilla JS (No heavy jQuery dependencies needed)
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navigation on Scroll
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        updateActiveNavLink();
    });

    // 2. Back to Top Click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 3. Mobile Navigation Drawer
    const mobileToggle = document.getElementById('mobileToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-contact-box a');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
    if (overlay) overlay.addEventListener('click', () => {
        closeMobileMenu();
        closeModalWindow();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // 4. ScrollSpy Active Nav Link Indicator
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 5. Interactive Menu Category Filtering
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button styling
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 6. Set Default Booking Date (Today)
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.value = today;
        bookingDateInput.min = today;
    }

    // 7. WhatsApp Quick Reservation Action
    const whatsappBookingBtn = document.getElementById('whatsappBookingBtn');
    
    function getBookingData() {
        return {
            name: document.getElementById('guestName').value.trim() || 'غير محدد',
            phone: document.getElementById('guestPhone').value.trim() || 'غير محدد',
            guests: document.getElementById('guestCount').value,
            date: document.getElementById('bookingDate').value || 'اليوم',
            time: document.getElementById('bookingTime').value,
            occasion: document.getElementById('occasionType').value,
            notes: document.getElementById('specialNotes').value.trim() || 'لا توجد'
        };
    }

    if (whatsappBookingBtn) {
        whatsappBookingBtn.addEventListener('click', () => {
            const data = getBookingData();
            
            if (data.name === 'غير محدد' || data.phone === 'غير محدد') {
                alert('يرجى إدخال الاسم ورقم الهاتف لإتمام الحجز عبر واتساب.');
                return;
            }

            const message = 
`👑 طلب حجز طاولة جديد - مطعم لوميير 👑
-------------------------------------
👤 الاسم: ${data.name}
📞 الهاتف: ${data.phone}
👥 عدد الضيوف: ${data.guests}
📅 التاريخ: ${data.date}
⏰ التوقيت: ${data.time}
🎉 نوع المناسبة: ${data.occasion}
📝 ملاحظات خاصة: ${data.notes}
-------------------------------------
أرجو تأكيد إمكانية الحجز وتفاصيل الطاولة المتاحة. شكراً لكم!`;

            const encodedMsg = encodeURIComponent(message);
            // Replace with actual restaurant phone number in international format
            const restaurantWhatsApp = '201000000000';
            const waUrl = `https://wa.me/${restaurantWhatsApp}?text=${encodedMsg}`;

            window.open(waUrl, '_blank');
        });
    }

    // 8. Booking Form Submit & Success Modal
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const modalDetails = document.getElementById('modalDetails');

    function closeModalWindow() {
        if (successModal) successModal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = getBookingData();

            modalDetails.innerHTML = `
                <p><strong>اسم الضيف:</strong> ${data.name}</p>
                <p><strong>تاريخ وتوقيت الحجز:</strong> ${data.date} في تمام ${data.time}</p>
                <p><strong>عدد الأفراد:</strong> ${data.guests}</p>
                <p><strong>المناسبة:</strong> ${data.occasion}</p>
                <p><strong>رقم التواصل:</strong> ${data.phone}</p>
            `;

            successModal.classList.add('active');
            overlay.classList.add('active');

            bookingForm.reset();
            if (bookingDateInput) {
                bookingDateInput.value = new Date().toISOString().split('T')[0];
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeModalWindow);
    }

    // 9. Gallery Lightbox Preview (Interactive Click)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('span') ? item.querySelector('span').innerText : '';
            
            // Simple preview modal
            modalDetails.innerHTML = `
                <div style="text-align:center;">
                    <img src="${img.src}" style="max-height:300px; width:100%; object-fit:cover; border-radius:12px; margin-bottom:12px;">
                    <p style="font-weight:700; color:var(--gold-light); font-size:1.1rem;">${caption}</p>
                </div>
            `;
            document.querySelector('#successModal h3').innerText = 'استعراض الصورة';
            document.querySelector('#modalMsg').innerText = 'أجواء مطعم لوميير الراقية';
            successModal.classList.add('active');
            overlay.classList.add('active');
        });
    });

});
