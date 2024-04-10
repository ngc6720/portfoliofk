import CONTENT from '/content.js'

// map project id to multiplayer id

export default (() => {
    const arr = Array(CONTENT.projects.length);
    arr.fill(-1);
    let j = 0;
    CONTENT.projects.map(project => project.audio).forEach((src, i) => {
        if (src === '')
            return;
            arr[i] = j;
        j++;
    })
    return arr;
})()