/* =========================================================
   NEON ARENA - MAIN JAVASCRIPT
   Demo booking system using LocalStorage
   ========================================================= */


/* ================= CONFIG ================= */

const STORAGE_KEY = "neonArenaBookings";

const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM"
];

let selectedDate = null;
let selectedTime = null;
let selectedSetup = "PC Gaming";


/* ================= DOM ================= */

const preloader = document.getElementById("preloader");

const dateSelector = document.getElementById("dateSelector");
const timeGrid = document.getElementById("timeGrid");

const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const summarySetup = document.getElementById("summarySetup");

const openBookingModal =
    document.getElementById("openBookingModal");

const bookingModal =
    document.getElementById("bookingModal");

const successModal =
    document.getElementById("successModal");

const closeBookingModal =
    document.getElementById("closeBookingModal");

const closeSuccessModal =
    document.getElementById("closeSuccessModal");

const bookingForm =
    document.getElementById("bookingForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");


/* ================= PRELOADER ================= */

window.addEventListener("load", () => {

    setTimeout(() => {
        preloader.classList.add("hidden");
    }, 1700);

});


/* ================= MOBILE MENU ================= */

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

});


document.querySelectorAll("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
    });

});


/* ================= GENERATE DATES ================= */

function generateDates() {

    dateSelector.innerHTML = "";

    const today = new Date();

    for (let i = 0; i < 7; i++) {

        const date = new Date(today);

        date.setDate(today.getDate() + i);

        const dayName = date.toLocaleDateString(
            "en-US",
            { weekday: "short" }
        );

        const monthName = date.toLocaleDateString(
            "en-US",
            { month: "short" }
        );

        const number = date.getDate();

        const dateKey = formatDateKey(date);

        const button =
            document.createElement("button");

        button.className = "date-option";

        button.dataset.date = dateKey;

        button.innerHTML = `
            <span class="day">
                ${i === 0 ? "TODAY" : dayName.toUpperCase()}
            </span>

            <span class="number">
                ${number}
            </span>
        `;

        button.addEventListener("click", () => {

            selectDate(dateKey);

        });

        dateSelector.appendChild(button);

    }

    selectDate(
        formatDateKey(today)
    );
}


/* ================= DATE FORMAT ================= */

function formatDateKey(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDisplayDate(dateKey) {

    const date =
        new Date(`${dateKey}T12:00:00`);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* ================= SELECT DATE ================= */

function selectDate(dateKey) {

    selectedDate = dateKey;

    document
        .querySelectorAll(".date-option")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.date === dateKey
            );

        });

    summaryDate.textContent =
        formatDisplayDate(dateKey);

    selectedTime = null;

    summaryTime.textContent =
        "Select slot";

    renderTimeSlots();

    updateBookingButton();
}


/* ================= LOCAL STORAGE ================= */

function getBookings() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    } catch (error) {

        console.error(
            "Could not read bookings:",
            error
        );

        return [];

    }
}


function saveBookings(bookings) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bookings)
    );

}


/* ================= BOOKING CHECK ================= */

function isSlotBooked(date, time, setup) {

    const bookings = getBookings();

    return bookings.some(booking =>
        booking.date === date &&
        booking.time === time &&
        booking.setup === setup
    );

}


/* ================= RENDER TIME SLOTS ================= */

function renderTimeSlots() {

    timeGrid.innerHTML = "";

    timeSlots.forEach(time => {

        const button =
            document.createElement("button");

        button.className = "time-slot";

        button.textContent = time;

        const booked =
            isSlotBooked(
                selectedDate,
                time,
                selectedSetup
            );

        if (booked) {

            button.classList.add("booked");

            button.disabled = true;

            button.title =
                "This slot has already been booked";

        } else {

            button.addEventListener(
                "click",
                () => selectTime(time)
            );

        }

        if (
            selectedTime === time &&
            !booked
        ) {

            button.classList.add("selected");

        }

        timeGrid.appendChild(button);

    });

}


/* ================= SELECT TIME ================= */

function selectTime(time) {

    selectedTime = time;

    document
        .querySelectorAll(".time-slot")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });

    const buttons =
        document.querySelectorAll(
            ".time-slot"
        );

    buttons.forEach(button => {

        if (button.textContent === time) {

            button.classList.add(
                "selected"
            );

        }

    });

    summaryTime.textContent = time;

    updateBookingButton();
}


/* ================= SETUP SELECTION ================= */

document
    .querySelectorAll(".setup-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".setup-option"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });

                button.classList.add("active");

                selectedSetup =
                    button.dataset.bookingSetup;

                summarySetup.textContent =
                    selectedSetup;

                selectedTime = null;

                summaryTime.textContent =
                    "Select slot";

                renderTimeSlots();

                updateBookingButton();

            }
        );

    });


/* ================= SETUP CTA BUTTONS ================= */

document
    .querySelectorAll("[data-setup]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const setup =
                    button.dataset.setup;

                selectedSetup = setup;

                document
                    .querySelectorAll(
                        ".setup-option"
                    )
                    .forEach(option => {

                        option.classList.toggle(
                            "active",
                            option.dataset.bookingSetup ===
                            setup
                        );

                    });

                summarySetup.textContent =
                    setup;

                renderTimeSlots();

            }
        );

    });


/* ================= BUTTON STATE ================= */

function updateBookingButton() {

    openBookingModal.disabled =
        !selectedDate ||
        !selectedTime ||
        !selectedSetup;

}


/* ================= OPEN BOOKING MODAL ================= */

openBookingModal.addEventListener(
    "click",
    () => {

        if (
            !selectedDate ||
            !selectedTime ||
            !selectedSetup
        ) {

            return;

        }

        /*
         * Last-second check.
         * This prevents a stale UI from booking
         * a slot that became unavailable.
         */

        if (
            isSlotBooked(
                selectedDate,
                selectedTime,
                selectedSetup
            )
        ) {

            alert(
                "Sorry! This slot has already been booked."
            );

            renderTimeSlots();

            selectedTime = null;

            summaryTime.textContent =
                "Select slot";

            updateBookingButton();

            return;

        }


        document.getElementById(
            "modalDate"
        ).textContent =
            formatDisplayDate(
                selectedDate
            );

        document.getElementById(
            "modalSetup"
        ).textContent =
            selectedSetup;

        document.getElementById(
            "modalTime"
        ).textContent =
            selectedTime;

        bookingModal.classList.add("show");

        document.body.classList.add(
            "modal-open"
        );

        setTimeout(() => {
            customerName.focus();
        }, 300);

    }
);


/* ================= CLOSE BOOKING MODAL ================= */

function closeModal() {

    bookingModal.classList.remove("show");

    document.body.classList.remove(
        "modal-open"
    );

}


closeBookingModal.addEventListener(
    "click",
    closeModal
);


/* ================= CLOSE OUTSIDE MODAL ================= */

bookingModal.addEventListener(
    "click",
    event => {

        if (
            event.target === bookingModal
        ) {

            closeModal();

        }

    }
);


/* ================= BOOKING FORM ================= */

bookingForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            customerName.value.trim();

        const phone =
            customerPhone.value.trim();


        if (name.length < 2) {

            alert(
                "Please enter a valid name."
            );

            return;

        }


        if (!/^\d{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            return;

        }


        /*
         * Check again before writing
         * the booking.
         */

        if (
            isSlotBooked(
                selectedDate,
                selectedTime,
                selectedSetup
            )
        ) {

            alert(
                "This slot is no longer available."
            );

            closeModal();

            selectedTime = null;

            summaryTime.textContent =
                "Select slot";

            renderTimeSlots();

            updateBookingButton();

            return;

        }


        const bookingId =
            generateBookingId();


        const booking = {

            id: bookingId,

            name: name,

            phone: phone,

            date: selectedDate,

            time: selectedTime,

            setup: selectedSetup,

            createdAt:
                new Date().toISOString()

        };


        const bookings =
            getBookings();

        bookings.push(booking);

        saveBookings(bookings);


        /*
         * Fill success modal.
         */

        document.getElementById(
            "bookingId"
        ).textContent =
            bookingId;

        document.getElementById(
            "successDate"
        ).textContent =
            formatDisplayDate(
                selectedDate
            );

        document.getElementById(
            "successTime"
        ).textContent =
            selectedTime;

        document.getElementById(
            "successSetup"
        ).textContent =
            selectedSetup;


        /*
         * Close form modal.
         */

        closeModal();

        bookingForm.reset();


        /*
         * Show success.
         */

        successModal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );


        /*
         * Refresh slots.
         */

        renderTimeSlots();

    }
);


/* ================= BOOKING ID ================= */

function generateBookingId() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `NA-${random}`;

}


/* ================= CLOSE SUCCESS ================= */

closeSuccessModal.addEventListener(
    "click",
    () => {

        successModal.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "modal-open"
        );

        selectedTime = null;

        summaryTime.textContent =
            "Select slot";

        renderTimeSlots();

        updateBookingButton();

    }
);


/* ================= SUCCESS OUTSIDE CLICK ================= */

successModal.addEventListener(
    "click",
    event => {

        if (
            event.target === successModal
        ) {

            successModal.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "modal-open"
            );

        }

    }
);


/* ================= ESCAPE KEY ================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            bookingModal.classList.remove(
                "show"
            );

            successModal.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "modal-open"
            );

        }

    }
);


/* ================= NAVBAR SCROLL ================= */

window.addEventListener(
    "scroll",
    () => {

        const navbar =
            document.querySelector(
                ".navbar"
            );

        if (window.scrollY > 30) {

            navbar.style.background =
                "rgba(5,5,7,0.92)";

        } else {

            navbar.style.background =
                "rgba(5,5,7,0.72)";

        }

    }
);


/* ================= EVENT BUTTON DEMO ================= */

document
    .querySelector(".event-button")
    .addEventListener(
        "click",
        () => {

            alert(
                "Tournament registration demo.\n\nConnect this button to your real registration system later."
            );

        }
    );


/* ================= INITIALIZE ================= */

generateDates();

summarySetup.textContent =
    selectedSetup;

updateBookingButton();
