import data from '../data/books.json' with {type: 'json'}

//יצירת מערך בלוקל סטורז
let booksList = JSON.parse(localStorage.getItem("booksList")) || [];
//דחיפת הנתונים ללוקל סטורז
localStorage.setItem("booksList", JSON.stringify(data.books));

document.addEventListener('DOMContentLoaded', () => {
    if (booksList) {
        showAllBooks();
    }
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
        tdUpdate.addEventListener('click', () => updateDetails(parseInt(tdId.textContent)));
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
        row.id = `row${i}`;
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
        numberInput.textContent = parseInt(numberInput.textContent) + 1; // העלה את הערך ב-1
    });

    decreaseButton.addEventListener('click', () => {
        numberInput.textContent = parseInt(numberInput.textContent) - 1; // הורד את הערך ב-1
    });


    detailsCard.appendChild(div)
}

const updateDetails = (bookId) => {
    booksList = JSON.parse(localStorage.getItem("booksList"));
}

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