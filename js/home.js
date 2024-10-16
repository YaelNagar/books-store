import data from '../data/books.json' with {type: 'json'}

// יצירת מערך בלוקל סטורז
let booksList = JSON.parse(localStorage.getItem("booksList")) || [];
let sortSelect = '';

let pagintionCount = 10;

// אם המערך ריק, דחיפת הנתונים
if (booksList.length === 0) {
    booksList = data.books; // טוען מהקובץ
    localStorage.setItem("booksList", JSON.stringify(booksList)); // שומר בלוקל סטורז
}

document.addEventListener('DOMContentLoaded', () => {
    showAllBooks();
    document.getElementById("priceSort").addEventListener('click',()=>sortByPrice());
    document.getElementById("titleSort").addEventListener('click',()=>sortByAB());
    document.getElementById("addbutton").addEventListener('click', () => createForm(1));
    pagentation();
});

const selector = () => {
    if (document.getElementById("priceSort").textContent === 'price ▼') {
        sortByPrice();
    } else if (document.getElementById("titleSort").textContent === 'title ▼') {
        sortByAB();
    }
}

//מיון לפי מחיר 
const sortByPrice = () => {
    document.getElementById("priceSort").textContent="price ▼";
    document.getElementById("titleSort").textContent="title ▲";
    booksList = booksList.sort((a, b) => a.price - b.price);
    localStorage.setItem("booksList", JSON.stringify(booksList));
    showAllBooks();
}

//מיון לפי שם ספר ללא התייחסות לאותיות קטנות וגדולות
const sortByAB = () => {
    debugger
    document.getElementById("titleSort").textContent="title ▼";
    document.getElementById("priceSort").textContent="price ▲";
    booksList = booksList.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    localStorage.setItem("booksList", JSON.stringify(booksList));
    showAllBooks();
}

//הצגת הdata
//בתחילה מציג 10 ראשונים בלבד
const showAllBooks = () => {
    const tableBody = document.getElementById("booksTable");
    // ניקוי התוכן הקיים בטבלה
    while (tableBody.children.length > 1) {
        tableBody.removeChild(tableBody.lastChild);
    }
    //יצירת תוכן הטבלה
    for (let i = 0; i < pagintionCount; i++) {
        const row = document.createElement('tr');
        const tdId = document.createElement("td");
        tdId.textContent = `${booksList[i].id}`;
        const tdTitle = document.createElement("td");
        tdTitle.textContent = `${booksList[i].title}`;
        const tdPrice = document.createElement("td");
        tdPrice.textContent = `${booksList[i].price} ₪`;
        const tdAction = document.createElement("td");
        tdAction.classList.add("read");
        tdAction.classList.add("pointer");
        tdAction.textContent = "👁️";
        tdAction.addEventListener('click', () => ShowDetails(parseInt(tdId.textContent)));
        const tdUpdate = document.createElement("td");
        tdUpdate.classList.add("update");
        tdUpdate.classList.add("pointer");
        tdUpdate.textContent = "✏️";
        tdUpdate.addEventListener('click', () => createForm(2, booksList[i]));
        const tdDelete = document.createElement("td");
        tdDelete.classList.add("delete");
        tdDelete.classList.add("pointer");
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
    let detailsCard = document.getElementsByClassName("details-container")[0];
    // הסרת כרטיס קיים
    detailsCard.innerHTML='';
    let showBook = booksList.filter(b => b.id == bookId);
    detailsCard.style.display = "block";

    // הוספת קלאס show כדי להתחיל את האנימציה
    setTimeout(() => {
        detailsCard.classList.add('show');
    }, 10); // ממתין כדי להבטיח שהשינוי יתקיים
    
    let header = document.createElement("div");
    header.classList.add("header", "spaceBetween");
    let h2 = document.createElement("h2");
    h2.textContent = showBook[0].title;
    let closeButton = document.createElement("button");
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => closeShowDetails());
    header.appendChild(closeButton);
    header.appendChild(h2);
    detailsCard.appendChild(header);

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
    decreaseButton.classList.add("decreaseButton")
    decreaseButton.textContent = '-';
    decreaseButton.id = 'decrease';

    const numberInput = document.createElement('div');
    numberInput.type = 'number';
    numberInput.id = 'numberInput';
    numberInput.textContent = `${Math.floor(showBook[0].rate)}`; 

    const increaseButton = document.createElement('button');
    increaseButton.classList.add("increaseButton")
    increaseButton.textContent = '+';
    increaseButton.id = 'increase';

    container.appendChild(price);
    rateDiv.appendChild(rate);
    rateDiv.appendChild(decreaseButton);
    rateDiv.appendChild(numberInput);
    rateDiv.appendChild(increaseButton);
    container.appendChild(rateDiv);
    div.appendChild(container);

    // הוספת אירועים לכפתורים של הדירוג
    increaseButton.addEventListener('click', () => {
        numberInput.textContent = parseInt(numberInput.textContent) + 1; // העלה את הערך ב-1
        showBook[0].rate++;
        updateDetails(showBook[0]);// עדכון לשמירת השינויים
    });

    decreaseButton.addEventListener('click', () => {
        numberInput.textContent = parseInt(numberInput.textContent) - 1; // הורד את הערך ב-1
        showBook[0].rate--;
        updateDetails(showBook[0]);
    });
    detailsCard.appendChild(div)
};


const updateOrAdd = (bookData, flag) => {
    flag == 1 ? addBook(bookData) : updateDetails(bookData);//בדיקה האם הטופס של יצירה או עדכון
}

const addBook = (bookData) => {
    closeBlackDivButton();
    if (booksList.findIndex(book => book.id == bookData.id) != -1) {// בדיקה אם הספר קיים כבר
        window.alert("this book is exist you can try update his fileds");
        return
    }
    // עדכון המערך המקומי
    bookData.id = parseInt(bookData.id);
    booksList.push(bookData);
    localStorage.setItem("booksList", JSON.stringify(booksList));
    // הצגת הטבלה המעודכנת
    pagentation();
    showAllBooks();
    selector();
}

const updateDetails = (bookData) => {
    closeBlackDivButton();
    let indexBookToUpdate = booksList.findIndex(book => book.id == bookData.id);
    booksList[indexBookToUpdate] = { ...bookData };
    localStorage.setItem("booksList", JSON.stringify(booksList));
    showAllBooks();// הצגת הרשימה לאחר העדכונים
    selector();// במידה ונבחר מיון מעדכן את המיון לאחר השינויים
}

//יצירת טופס לעדכון או הוספה
const createForm = (flag, bookData) => {
    let opacityDiv = document.createElement("div");
    opacityDiv.classList.add("blackOpacityDiv");
    let header = document.createElement("div");
    header.classList.add("header");
    let h1 = document.createElement("h1");
    flag == 2 ? h1.textContent = "update the book fields:" : h1.textContent = "add the book fields:";
    let closeButton = document.createElement("button");
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => closeBlackDivButton());
    header.appendChild(closeButton);
    header.appendChild(h1);
    opacityDiv.appendChild(header);

    const formContainer = document.getElementById('formContainer');
    const form = document.createElement('form');
    form.id = 'dynamicForm';

    //הגדרת מערך של שדות הטופס
     let fields = [
            { label: 'ID', name: 'id', type: 'number', required: true },
            { label: 'Title', name: 'title', type: 'text' },
            { label: 'Price', name: 'price', type: 'number' },
            { label: 'Image URL', name: 'image', type: 'file' },
            { label: 'Rate', name: 'rate', type: 'number', min: 1, max: 5 }
        ];

    //יצירת הטפס בלולאה על השדות שהוגדרו
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

        //במצב עריכה, id לא מאופשר
        if (field.name === 'id' && flag !== 1) {
            input.setAttribute('readonly', true);
        }

        // ממלא את השדות שאינם קובץ -תמונה
        if (flag !== 1 && field.type !== 'file') {
            input.value = bookData[field.name] || ''; // ממלא את השדה עם הערך אם קיים
        }

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });


    const submitButton = document.createElement('button');
    submitButton.classList.add("button");
    submitButton.textContent = 'send';
    submitButton.type = 'button'; // מונע שליחה אוטומטית
    submitButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
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
    pagentation();// עידכון מספר העמודים למעבר באתר
    showAllBooks();// הצגת הטבלה המעודכנת
}

//סגירת הדיב שמציג את הטפסים
const closeBlackDivButton = () => {
    let blackScrean = document.getElementsByClassName("blackOpacityDiv")[0];
    if (blackScrean)
        document.getElementsByClassName("container")[0].removeChild(blackScrean);
}

const closeShowDetails = () => {//הצגת הפרטים באנימציה מימין במסך פלאפון
    let detailsCard = document.getElementsByClassName("details-container")[0];
    detailsCard.classList.remove('show'); // מסיר את האנימציה
    setTimeout(() => {
        detailsCard.style.display = "none"; // מסתיר את הכרטיס
    }, 500); // תואם את זמן האנימציה ב-CSS
};

const pagentation = () => {//יצירת המעבר בין עמודי הצגת הספרים באתר
    let pag=document.getElementsByTagName("footer")[0];
    if(pag)
        pag.innerHTML='';
    let pagentationDiv = document.createElement("div");
    pagentationDiv.id="pagentationDiv";
    let pagentationNumber;
    booksList.length % 10 == 0 ? pagentationNumber = booksList.length / 10 : pagentationNumber = (Math.floor(booksList.length / 10) + 1);
    if(pagentationNumber==1)//במידה וקיימים עד 10 ספרים אין אפשרות למעבר
        return
    for (let i = 0; i < pagentationNumber; i++) {
        let pagentationButton = document.createElement("button");
        pagentationButton.classList.add("pagentation");
        pagentationButton.id = `${i + 1}`;
        pagentationButton.addEventListener('click', () => lengthToShow(pagentationButton.id));
        pagentationButton.textContent = `${i + 1}`;
        pagentationDiv.appendChild(pagentationButton);
    }
    document.getElementsByTagName("footer")[0].appendChild(pagentationDiv);
}

const lengthToShow = (id) => {//מעדכן את המשתנה עליו רצה לולאת ההצגה של הטבלה
    if (id == (Math.floor(booksList.length / 10) + 1))//בעת לחיצה על העמוד האחרון
        pagintionCount = booksList.length;//הצגת כלל הספרים
    else pagintionCount = id * 10;//אחרת הצגה בכפולות של 10
    showAllBooks()//עדכון הטבלה המוצגת לכמות 
}