/**
 * Generate a random name (used to set cookie names)
 */
function randomName() {
  return (Math.random() + 1).toString(36).substring(7)
}

/**
 * Get Value of a cookie
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

/**
 * Get total count of cookies accessible via JS
 */
function getCookieCount() {
  let cookieCount = 0;

  if (document.cookie) {
    if (! document.cookie.match(/;/g)) cookieCount = 1;
    else cookieCount = document.cookie.match(/;/g).length + 1;
  }
  
  return cookieCount;
}

function testMaxCookiesPerDomain() {
  // Max number of times we will try creating a cookie
  // I have noticed currently in Firefox and Safari I can set 5000 and more cookies
  const MAX_TRIES = 1000;
  
  const cookiesCreated = [];
  let maxCookieCount = 0;

  while (true) {
    const cookieName = randomName();
    
    document.cookie = `${cookieName}=${randomName()};`;
    cookiesCreated.push(cookieName);

    const cookieCount = getCookieCount();
    
    if (cookieCount > maxCookieCount) maxCookieCount = cookieCount;
    else break;
    
    if (maxCookieCount > MAX_TRIES) {
      document.querySelector('.too-many-cookies').style.display = 'block';
      break;
    }
  }
  
  // Delete the (random) cookies created
  for (const cookieName of cookiesCreated) {
    document.cookie = `${cookieName}=random_val; Max-Age=-1`;
  }
  
  return maxCookieCount;
}

function testCookieSizeLimit() {
  const cookieName = randomName();
  let cookieVal = 'a';

  while (true) {
    const cookieStr = `${cookieName}=${cookieVal};`;
    
    const oldCookieVal = getCookie(cookieName);
    document.cookie = cookieStr;
    const newCookieVal = getCookie(cookieName);
    
    if (oldCookieVal && newCookieVal && oldCookieVal.length === newCookieVal.length) break;
    else cookieVal += 'a';
  }

  const maxCookieSizeInBytes = getCookie(cookieName).length + cookieName.length;

  // Delete the cookie
  document.cookie = `${cookieName}=; Max-Age=-1`;
  
  return maxCookieSizeInBytes;
}

document.querySelector('#cookie_limit').textContent = testMaxCookiesPerDomain();
document.querySelector('#cookie_size').textContent = testCookieSizeLimit();

// console.log(document.cookie);