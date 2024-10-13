import data from '../data/books.json' with {type: 'json'}

// יצירת מערך בלוקל סטורז
let booksList = JSON.parse(localStorage.getItem("booksList")) || [];

// אם המערך ריק, דחיפת הנתונים
if (booksList.length === 0) {
    booksList = data.books; // טוען מהקובץ
    localStorage.setItem("booksList", JSON.stringify(booksList)); // שומר בלוקל סטורז
}

document.addEventListener('DOMContentLoaded', () => {
    showAllBooks();
    document.getElementById("addbutton").addEventListener('click', () => createForm(1));
});

const showAllBooks = () => {
    const tableBody = document.getElementById("booksTable");
    // ניקוי התוכן הקיים בטבלה
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    for (let i = 0; i < booksList.length; i++) {
        const row = document.createElement('tr');
        const tdId = document.createElement("td");
        tdId.textContent = `${booksList[i].id}`;
        const tdTitle = document.createElement("td");
        tdTitle.textContent = `${booksList[i].title}`;
        const tdPrice = document.createElement("td");
        tdPrice.textContent = `${booksList[i].price} ₪`;
        const tdAction = document.createElement("td");
        tdAction.classList.add("read");
        tdAction.textContent = "Read";
        tdAction.addEventListener('click', () => ShowDetails(parseInt(tdId.textContent)));
        const tdUpdate = document.createElement("td");
        tdUpdate.classList.add("update");
        tdUpdate.textContent = "Update";
        tdUpdate.addEventListener('click', () => createForm(2));
        const tdDelete = document.createElement("td");
        tdDelete.classList.add("delete");
        tdDelete.textContent = "🗑️";
        tdDelete.addEventListener('click', () => deleteBook(parseInt(tdId.textContent)));

        row.appendChild(tdId);
        row.appendChild(tdTitle);
        row.appendChild(tdPrice);
        row.appendChild(tdAction);
        row.appendChild(tdUpdate);
        row.appendChild(tdDelete);
        tableBody.appendChild(row);
    }
}

const ShowDetails = (bookId) => {
    debugger
    let showBook = booksList.filter(b => b.id == bookId);
    console.log(showBook);
    let detailsCard = document.getElementsByClassName("details-container")[0];
    detailsCard.style.display = "block";
    let h2 = document.createElement("h2");
    h2.textContent = showBook[0].title;
    detailsCard.appendChild(h2);
    let div = document.createElement("div");
    div.classList.add("detailsDiv");
    let CoverImage = document.createElement("img");
    CoverImage.src = `${showBook[0].image}`;
    CoverImage.classList.add("CoverImage")
    div.appendChild(CoverImage);

    const container = document.createElement('div');
    container.classList.add("detailsContainer");

    let price = document.createElement("p");
    price.textContent = `price: ${showBook[0].price} ₪`;

    let rateDiv = document.createElement("div");
    rateDiv.classList.add("rate");
    let rate = document.createElement("p");
    rate.textContent = "rate:";
    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.id = 'decrease';

    const numberInput = document.createElement('div');
    numberInput.type = 'number';
    numberInput.id = 'numberInput';
    numberInput.textContent = `${showBook[0].rate}`; // ערך התחלתי

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.id = 'increase';

    container.appendChild(price);
    rateDiv.appendChild(rate);
    rateDiv.appendChild(decreaseButton);
    rateDiv.appendChild(numberInput);
    rateDiv.appendChild(increaseButton);
    container.appendChild(rateDiv);
    div.appendChild(container);

    // הוספת אירועים לכפתורים
    increaseButton.addEventListener('click', () => {
        //לעדכן בstorage
        numberInput.textContent = parseInt(numberInput.textContent) + 1; // העלה את הערך ב-1
        showBook[0].rate++;
        updateDetails(showBook[0]);
    });

    decreaseButton.addEventListener('click', () => {
        numberInput.textContent = parseInt(numberInput.textContent) - 1; // הורד את הערך ב-1
        showBook[0].rate--;
        updateDetails(showBook[0]);
    });
    detailsCard.appendChild(div)
}

const updateOrAdd = (bookData, flag) => {
    flag == 1 ? addBook(bookData) : updateDetails(bookData);
}

const addBook = (bookData) => {
    let blackScrean = document.getElementsByClassName("blackOpacityDiv")[0];
    document.getElementsByClassName("container")[0].removeChild(blackScrean);
    console.log("add");
    // עדכון המערך המקומי
    debugger
    bookData.id = parseInt(bookData.id);
    booksList.push(bookData);
    localStorage.setItem("booksList", JSON.stringify(booksList));
    // הצגת הטבלה המעודכנת
    showAllBooks();
    console.log(booksList);
}

const updateDetails = (bookData) => {
    debugger
    let blackScrean = document.getElementsByClassName("blackOpacityDiv")[0];
    if (blackScrean)
        document.getElementsByClassName("container")[0].removeChild(blackScrean);
    console.log("update");
    let bookToUpdate = booksList.find(book => book.id == bookData.id);
    let indexBookToUpdate = booksList.findIndex(book => book.id == bookData.id);
    if (indexBookToUpdate == -1)
        window.alert("this book is not exist please add it before you update");
    debugger
    bookData.title != '' ? bookToUpdate.title = bookData.title : bookToUpdate.title = booksList[indexBookToUpdate].title;
    bookData.price != '' ? bookToUpdate.price = bookData.price : bookToUpdate.price = booksList[indexBookToUpdate].price;
    bookData.image != '' ? bookToUpdate.image = bookData.image : bookToUpdate.image = booksList[indexBookToUpdate].image;
    bookData.rate != '' ? bookToUpdate.rate = bookData.rate : bookToUpdate.rate = booksList[indexBookToUpdate].rate;
    booksList[indexBookToUpdate] = { ...bookToUpdate };
    localStorage.setItem("booksList", JSON.stringify(booksList));
    showAllBooks();
}

const createForm = (flag) => {
    let opacityDiv = document.createElement("div");
    opacityDiv.classList.add("blackOpacityDiv");
    let h1 = document.createElement("h1");
    h1.textContent = "update the book fields:";
    opacityDiv.appendChild(h1);

    const formContainer = document.getElementById('formContainer');
    const form = document.createElement('form');
    form.id = 'dynamicForm';

    //הגדרת מערך של שדות הטופס
    const fields = [
        { label: 'ID', name: 'id', type: 'number' },
        { label: 'Title', name: 'title', type: 'text' },
        { label: 'Price', name: 'price', type: 'number' },
        { label: 'Image URL', name: 'image', type: 'url' },
        { label: 'Rate', name: 'rate', type: 'number' }
    ];

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        const label = document.createElement('label');
        label.textContent = field.label;
        label.setAttribute('for', field.name);

        const input = document.createElement('input');
        input.type = field.type;
        input.name = field.name;
        input.id = field.name;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'send';
    submitButton.type = 'button'; // מונע שליחה אוטומטית
    submitButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log(data);
        updateOrAdd(data, flag);
    });

    form.appendChild(submitButton);
    opacityDiv.appendChild(form);
    document.getElementsByClassName("container")[0].appendChild(opacityDiv);
};


const deleteBook = (bookId) => {
    booksList = JSON.parse(localStorage.getItem("booksList"));
    // סינון הרשימה כדי להסיר את הספר שנמחק
    let updateBooksList = booksList.filter(b => b.id !== bookId);
    // עדכון ה-local storage
    localStorage.setItem("booksList", JSON.stringify(updateBooksList));
    // עדכון המערך המקומי
    booksList = updateBooksList;
    // הצגת הטבלה המעודכנת
    showAllBooks();
    console.log(booksList);
}