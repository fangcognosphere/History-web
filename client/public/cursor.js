(function oneko() {
    // Hàm này sẽ được gọi khi anime.js đã sẵn sàng
    function initNekoWithAnime() {
        const isReducedMotion =
          window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
          window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
      
        if (isReducedMotion) return;
      
        const nekoEl = document.createElement("div");
      
        let nekoPosX = 32;
        let nekoPosY = 32;
      
        let mousePosX = 0;
        let mousePosY = 0;
      
        let frameCount = 0;
        let idleTime = 0;
        let idleAnimation = null;
        let idleAnimationFrame = 0;
        let currentAnimation = null;
      
        const nekoSpeed = 10;
        const spriteSets = {
          idle: [[-3, -3]],
          alert: [[-7, -3]],
          scratchSelf: [
            [-5, 0],
            [-6, 0],
            [-7, 0],
          ],
          scratchWallN: [
            [0, 0],
            [0, -1],
          ],
          scratchWallS: [
            [-7, -1],
            [-6, -2],
          ],
          scratchWallE: [
            [-2, -2],
            [-2, -3],
          ],
          scratchWallW: [
            [-4, 0],
            [-4, -1],
          ],
          tired: [[-3, -2]],
          sleeping: [
            [-2, 0],
            [-2, -1],
          ],
          N: [
            [-1, -2],
            [-1, -3],
          ],
          NE: [
            [0, -2],
            [0, -3],
          ],
          E: [
            [-3, 0],
            [-3, -1],
          ],
          SE: [
            [-5, -1],
            [-5, -2],
          ],
          S: [
            [-6, -3],
            [-7, -2],
          ],
          SW: [
            [-5, -3],
            [-6, -1],
          ],
          W: [
            [-4, -2],
            [-4, -3],
          ],
          NW: [
            [-1, 0],
            [-1, -1],
          ],
        };
      
        function init() {
          nekoEl.id = "oneko";
          nekoEl.ariaHidden = true;
          nekoEl.style.width = "32px";
          nekoEl.style.height = "32px";
          nekoEl.style.position = "fixed";
          nekoEl.style.pointerEvents = "none";
          nekoEl.style.imageRendering = "pixelated";
          nekoEl.style.left = `${nekoPosX - 16}px`;
          nekoEl.style.top = `${nekoPosY - 16}px`;
          nekoEl.style.zIndex = 2147483647;
      
          let nekoFile = "/oneko.gif";
          const curScript = document.currentScript;
          if (curScript && curScript.dataset.cat) {
            nekoFile = curScript.dataset.cat;
          }
          nekoEl.style.backgroundImage = `url(${nekoFile})`;
      
          document.body.appendChild(nekoEl);
      
          document.addEventListener("mousemove", function (event) {
            mousePosX = event.clientX;
            mousePosY = event.clientY;
          });
      
          window.requestAnimationFrame(onAnimationFrame);
        }
      
        let lastFrameTimestamp;
      
        function onAnimationFrame(timestamp) {
          // Stops execution if the neko element is removed from DOM
          if (!nekoEl.isConnected) {
            return;
          }
          if (!lastFrameTimestamp) {
            lastFrameTimestamp = timestamp;
          }
          if (timestamp - lastFrameTimestamp > 100) {
            lastFrameTimestamp = timestamp;
            frame();
          }
          window.requestAnimationFrame(onAnimationFrame);
        }
      
        function setSprite(name, frame) {
          const sprite = spriteSets[name][frame % spriteSets[name].length];
          nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
        }
      
        function resetIdleAnimation() {
          idleAnimation = null;
          idleAnimationFrame = 0;
        }
      
        function idle() {
          idleTime += 1;
      
          // every ~ 20 seconds
          if (
            idleTime > 10 &&
            Math.floor(Math.random() * 200) == 0 &&
            idleAnimation == null
          ) {
            let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
            if (nekoPosX < 32) {
              avalibleIdleAnimations.push("scratchWallW");
            }
            if (nekoPosY < 32) {
              avalibleIdleAnimations.push("scratchWallN");
            }
            if (nekoPosX > window.innerWidth - 32) {
              avalibleIdleAnimations.push("scratchWallE");
            }
            if (nekoPosY > window.innerHeight - 32) {
              avalibleIdleAnimations.push("scratchWallS");
            }
            idleAnimation =
              avalibleIdleAnimations[
                Math.floor(Math.random() * avalibleIdleAnimations.length)
              ];
          }
      
          switch (idleAnimation) {
            case "sleeping":
              if (idleAnimationFrame < 8) {
                setSprite("tired", 0);
                break;
              }
              setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
              if (idleAnimationFrame > 192) {
                resetIdleAnimation();
              }
              break;
            case "scratchWallN":
            case "scratchWallS":
            case "scratchWallE":
            case "scratchWallW":
            case "scratchSelf":
              setSprite(idleAnimation, idleAnimationFrame);
              if (idleAnimationFrame > 9) {
                resetIdleAnimation();
              }
              break;
            default:
              setSprite("idle", 0);
              return;
          }
          idleAnimationFrame += 1;
        }
      
        function frame() {
          frameCount += 1;
          const diffX = nekoPosX - mousePosX;
          const diffY = nekoPosY - mousePosY;
          const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
      
          if (distance < nekoSpeed || distance < 48) {
            idle();
            return;
          }
      
          idleAnimation = null;
          idleAnimationFrame = 0;
      
          if (idleTime > 1) {
            setSprite("alert", 0);
            // count down after being alerted before moving
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
          }
      
          let direction;
          direction = diffY / distance > 0.5 ? "N" : "";
          direction += diffY / distance < -0.5 ? "S" : "";
          direction += diffX / distance > 0.5 ? "W" : "";
          direction += diffX / distance < -0.5 ? "E" : "";
          setSprite(direction, frameCount);
      
          // Tính điểm đích cho animation
          const targetX = nekoPosX - (diffX / distance) * nekoSpeed;
          const targetY = nekoPosY - (diffY / distance) * nekoSpeed;
          
          // Đảm bảo neko nằm trong giới hạn của cửa sổ
          const boundedTargetX = Math.min(Math.max(16, targetX), window.innerWidth - 16);
          const boundedTargetY = Math.min(Math.max(16, targetY), window.innerHeight - 16);
          
          // Nếu đang có animation, hủy nó trước khi tạo mới
          if (currentAnimation) {
            currentAnimation.pause();
          }
          
          // Sử dụng anime.js (thông qua biến window.anime) để tạo animation
          currentAnimation = window.anime({
            targets: nekoEl,
            left: `${boundedTargetX - 16}px`,
            top: `${boundedTargetY - 16}px`,
            duration: 100,
            easing: 'linear',
            update: function() {
              // Cập nhật vị trí của neko từ style thực tế
              const leftMatch = nekoEl.style.left.match(/(-?\d+\.?\d*)/);
              const topMatch = nekoEl.style.top.match(/(-?\d+\.?\d*)/);
              
              if (leftMatch && topMatch) {
                nekoPosX = parseFloat(leftMatch[0]) + 16;
                nekoPosY = parseFloat(topMatch[0]) + 16;
              }
            }
          });
        }
      
        init();
    }

    // Biến để theo dõi số lần đã thử
    let attemptCount = 0;
    const MAX_ATTEMPTS = 20; // Giới hạn số lần thử (khoảng 2 giây)
    
    // Kiểm tra nếu anime.js đã tải xong
    function checkAndInitNeko() {
        if (typeof window.anime === 'function') {
            // Anime.js đã sẵn sàng
            console.log("Anime.js đã được tải thành công!");
            initNekoWithAnime();
        } else {
            attemptCount++;
            // Chỉ hiển thị thông báo cho lần thử đầu tiên và mỗi 5 lần sau đó
            if (attemptCount === 1 || attemptCount % 5 === 0) {
                console.log(`Đang đợi anime.js tải... (lần thử ${attemptCount}/${MAX_ATTEMPTS})`);
            }
            
            // Nếu đã thử quá số lần giới hạn, dừng việc thử lại
            if (attemptCount >= MAX_ATTEMPTS) {
                console.warn("Không thể tải anime.js sau nhiều lần thử. Hiệu ứng con mèo sẽ không hoạt động.");
                // Thử tải anime.js trực tiếp
                loadAnimeJS();
                return;
            }
            
            // Đợi thêm 100ms và kiểm tra lại
            setTimeout(checkAndInitNeko, 100);
        }
    }
    
    // Hàm tải anime.js trực tiếp nếu không tìm thấy
    function loadAnimeJS() {
        // Kiểm tra xem script đã tồn tại chưa
        if (document.querySelector('script[src*="anime.min.js"]')) {
            console.log("Đã tìm thấy script anime.js trong trang. Đang thử khởi động lại...");
            setTimeout(checkAndInitNeko, 500); // Thử lại sau 500ms
            return;
        }
        
        console.log("Đang thử tải anime.js trực tiếp...");
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/animejs@4.0.1/lib/anime.min.js';
        script.onload = function() {
            console.log("Anime.js đã được tải thành công từ CDN!");
            // Đợi một chút để đảm bảo script đã sẵn sàng
            setTimeout(function() {
                if (typeof window.anime === 'function') {
                    initNekoWithAnime();
                } else {
                    console.error("Anime.js đã được tải nhưng không thể truy cập. Hiệu ứng con mèo sẽ không hoạt động.");
                }
            }, 200);
        };
        script.onerror = function() {
            console.error("Không thể tải anime.js từ CDN. Hiệu ứng con mèo sẽ không hoạt động.");
        };
        document.head.appendChild(script);
    }

    // Tự động tải anime.js nếu cần
    function initialize() {
        // Kiểm tra nếu anime.js đã có sẵn
        if (typeof window.anime === 'function') {
            console.log("Anime.js đã sẵn sàng, khởi tạo con mèo ngay lập tức!");
            initNekoWithAnime();
            return;
        }
        
        // Nếu chưa, bắt đầu kiểm tra
        checkAndInitNeko();
    }

    // Đợi cho đến khi tài liệu HTML tải xong trước khi bắt đầu kiểm tra
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOMContentLoaded đã kích hoạt
        initialize();
    }
})();