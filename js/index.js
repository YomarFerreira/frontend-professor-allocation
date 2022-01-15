      const URLbase = `https://recode-6-professor-allocation.herokuapp.com`;


      function openModalLogin() {
          const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})

          modal.show();
      }


      // Cookies

      // create a cookie
      function setCookie(name, value, duration) {

          // let cookie = name + "=" + escape(value) + ((duration) ? "; duration=" + duration.toGMTString() : "");
          //document.cookie = cookie;
          document.cookie = "username=user; expires=Thu, 31 Dec 2021 12:00:00 UTC";

      }

      setCookie('yomar', '1', 100)

      // read a cookie
      function getCookie(name) {
          let cookies = document.cookie;
          let prefix = name + "=";
          let begin = cookies.indexOf("; " + prefix);

          if (begin == -1) {

              begin = cookies.indexOf(prefix);

              if (begin != 0) {
                  return null;
              }

          } else {
              begin += 2;
          }

          let end = cookies.indexOf(";", begin);

          if (end == -1) {
              end = cookies.length;
          }

          return unescape(cookies.substring(begin + prefix.length, end));
      }


      // delete a cookie
      function deleteCookie(name) {
          if (getCookie(name)) {
              document.cookie = name + "=" + "; expires=Thu, 31-Dec-2021 00:00:01 GMT";
          }
      }