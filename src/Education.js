import React from 'react'

const Education = () => {
  return (
    <section className="education-section">
      <h2>History of the Electoral College</h2>
      <p>The Electoral College is the process by which the President (and Vice President) of the United States are chosen. Established in the US Constitution, the College allocates a number of votes to each states depending on the combined number of representatives the state has in the House and Senate. Upon ratification of the 23rd amendment in 1961, the District of Columbia was allocated 3 electoral votes as well.</p>
      <p>Each state has a minimum of 3 electoral votes, with the least populous states typically having one representative to the House and two to the Senate. While the number of Senators does not change, the number of House seats a state has does every ten years after the completion of the US census. Based on the number of people counted, House seats may be redistributed as necessary.</p>
      <p>The system results in some states having more power in the Electoral College than others. The visualization above shows what that looks like during different years in US history. This strength score is calculated from taking the ratio of a state's votes to its population and dividing that by the ratio of the country's votes to its population for a given year. If a state's score is 1.0, it means the average citizen's vote is just a strong as if the College was replaced by a popular vote system and each citizen's vote counted equally. </p>
      <div className="references-list">
        <h4>References</h4>
        <ul>
          <li><a href="https://www.archives.gov/federal-register/electoral-college/about.html">National Archives: What is the Electoral College?</a></li>
          <li><a href="https://www.archives.gov/federal-register/electoral-college/provisions.html#23">National Archives: Presidential Election Laws</a></li>
        </ul>
      </div>
    </section>
  )
}

export default Education