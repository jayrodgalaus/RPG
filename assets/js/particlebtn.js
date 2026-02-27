
document.querySelectorAll("button.particleButton").forEach(btn => {
    let btnBg = btn.parentNode.querySelector(".particles")
    let initalListener = () => {
        if(btnBg.classList.contains("animated")) return
        btnBg.classList.add("animated")
        setTimeout(() => {
            btnBg.classList.remove("animated")
        }, 1700)
    }
    btn.addEventListener("mouseover", initalListener)
})
